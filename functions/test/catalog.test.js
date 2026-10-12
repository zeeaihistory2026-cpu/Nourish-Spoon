const { test } = require("node:test");
const assert = require("node:assert/strict");
const { normalizeProduct } = require("../lib/normalizeProduct");
const { priceOrder } = require("../src/domain");
test("existing catalogue retains server prices, active state and stable variant IDs", () => {
  const product = normalizeProduct("date-nut-balls", {
    name: "Date & Nuts Energy Balls",
    isActive: true,
    stock: 3,
    variants: [
      { label: "250g", price: 1999 },
      { label: "500g", price: 3899 },
    ],
  });
  assert.equal(product.id, "date-nut-balls");
  assert.equal(product.active, true);
  assert.equal(product.variants[0].id, "date-nut-balls:250g");
  assert.throws(() =>
    priceOrder(
      [
        {
          product_id: product.id,
          variant_id: product.variants[0].id,
          quantity: 2,
        },
        {
          product_id: product.id,
          variant_id: product.variants[1].id,
          quantity: 2,
        },
      ],
      [product],
      {},
      "self_pickup",
      false,
    ),
  );
});
test("canonical sale-price removal never resurrects a legacy sale price", () => {
  const product = normalizeProduct("p", {
    active: false,
    inventory_mode: "per_variant",
    stock: 1,
    variants: [
      {
        weight: "250g",
        regular_price: 2199,
        sale_price: null,
        price: 1999,
        stock: 5,
      },
    ],
  });
  assert.equal(product.active, false);
  assert.equal(product.variants[0].sale_price, null);
  assert.equal(product.legacy_stock, null);
});
