import type { Product } from "@packages/types";

/** Only a previously server-verified catalogue can unlock prices on startup. */
export function readVerifiedCatalogue(products: unknown, verifiedAt: unknown) {
  if (
    typeof verifiedAt !== "number" ||
    !Number.isFinite(verifiedAt) ||
    verifiedAt <= 0 ||
    verifiedAt > Date.now() + 300000 ||
    !Array.isArray(products) ||
    products.length > 2000
  )
    return null;
  const valid = products.every(
    (product) =>
      product &&
      typeof product.id === "string" &&
      typeof product.name === "string" &&
      typeof product.active === "boolean" &&
      Array.isArray(product.variants) &&
      product.variants.every(
        (variant: Record<string, unknown>) =>
          variant &&
          typeof variant.id === "string" &&
          typeof variant.weight === "string" &&
          typeof variant.active === "boolean" &&
          Number.isSafeInteger(variant.regular_price) &&
          Number(variant.regular_price) >= 0 &&
          (variant.sale_price == null ||
            (Number.isSafeInteger(variant.sale_price) &&
              Number(variant.sale_price) >= 0)),
      ),
  );
  return valid ? { products: products as Product[], verifiedAt } : null;
}
