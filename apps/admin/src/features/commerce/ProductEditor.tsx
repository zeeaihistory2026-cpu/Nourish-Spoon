import React, { useEffect, useState } from "react";
import { Product } from "@packages/types";
export function ProductEditor({
  product,
  busy,
  save,
}: {
  product: Product;
  busy: boolean;
  save: (patch: Partial<Product>) => void;
}) {
  const [name, setName] = useState(product.name),
    [description, setDescription] = useState(product.short_description),
    [active, setActive] = useState(product.active),
    [variants, setVariants] = useState(product.variants);
  useEffect(() => {
    setName(product.name);
    setDescription(product.short_description);
    setActive(product.active);
    setVariants(product.variants);
  }, [product]);
  return (
    <article>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />{" "}
        Available for sale
      </label>
      {variants.map((variant, index) => (
        <div className="fields" key={variant.id}>
          <strong>{variant.weight}</strong>
          <label>
            Sale price (PKR)
            <input
              type="number"
              min="1"
              step="1"
              value={variant.sale_price ?? variant.regular_price}
              onChange={(event) =>
                setVariants((current) =>
                  current.map((v, i) =>
                    i === index
                      ? { ...v, sale_price: Number(event.target.value) }
                      : v,
                  ),
                )
              }
            />
          </label>
          <label>
            Stock (empty = unmanaged)
            <input
              type="number"
              min="0"
              step="1"
              value={variant.stock ?? ""}
              onChange={(event) =>
                setVariants((current) =>
                  current.map((v, i) =>
                    i === index
                      ? {
                          ...v,
                          stock:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        }
                      : v,
                  ),
                )
              }
            />
          </label>
        </div>
      ))}
      <button
        disabled={
          busy ||
          !name.trim() ||
          variants.some(
            (v) =>
              !Number.isInteger(v.sale_price ?? v.regular_price) ||
              (v.sale_price ?? v.regular_price) <= 0 ||
              (v.stock != null && (!Number.isInteger(v.stock) || v.stock < 0)),
          )
        }
        onClick={() =>
          save({
            name: name.trim(),
            short_description: description.trim(),
            active,
            variants,
            inventory_mode: "per_variant",
          })
        }
      >
        Save Product
      </button>
    </article>
  );
}
