const { test } = require("node:test");
const assert = require("node:assert/strict");
const { priceOrder, address, statusChange } = require("../src/domain");
const products = [
  {
    id: "p",
    name: "Panjeeri",
    active: true,
    variants: [
      {
        id: "v",
        active: true,
        stock: 3,
        regular_price: 1600,
        sale_price: 1499,
        weight: "250g",
      },
    ],
  },
];
const lines = [
  { product_id: "p", variant_id: "v", quantity: 2, unit_price: 1 },
];
test("ignores client prices and calculates authoritative total", () =>
  assert.deepEqual(
    priceOrder(
      lines,
      products,
      { delivery_fees: { tcs_nationwide: 250 } },
      "tcs_nationwide",
      false,
    ),
    {
      items: [
        {
          product_id: "p",
          variant_id: "v",
          product_name: "Panjeeri",
          variant_weight: "250g",
          quantity: 2,
          unit_price: 1499,
          total_price: 2998,
        },
      ],
      subtotal: 2998,
      discount: 0,
      delivery_fee: 0,
      total: 2998,
      quote_pending: false,
    },
  ));
test("orders use the standard delivery policy even without old settings", () =>
  assert.equal(
    priceOrder(lines, products, {}, "tcs_nationwide", false).total,
    2998,
  ));
test("shipping is 250 through Rs. 2500, free above it, and pickup is free", () => {
  const { deliveryCharge } = require("../lib/delivery");
  for (const method of ["tcs_nationwide", "sargodha_sameday"]) {
    for (const total of [0, 2499, 2500])
      assert.equal(deliveryCharge(total, method), 250);
    assert.equal(deliveryCharge(2501, method), 0);
  }
  assert.equal(deliveryCharge(100, "self_pickup"), 0);
  assert.throws(() => deliveryCharge(-1, "tcs_nationwide"));
  assert.throws(() => deliveryCharge(100, "invalid"));
});
test("rejects overselling, duplicate lines, zero, fractional and excessive quantities", () => {
  for (const quantity of [0, -1, 1.5, 4, 21])
    assert.throws(() =>
      priceOrder(
        [{ ...lines[0], quantity }],
        products,
        {},
        "tcs_nationwide",
        true,
      ),
    );
  assert.throws(() =>
    priceOrder([...lines, ...lines], products, {}, "tcs_nationwide", true),
  );
});
test("custom cities are accepted and malformed addresses rejected", () => {
  assert.equal(
    address({
      name: "Customer",
      phone: "03001234567",
      city: "Chiniot",
      line: "Street 4",
    }).city,
    "Chiniot",
  );
  assert.throws(() =>
    address({ name: "C", phone: "12", city: "X", line: "4" }),
  );
});
test("fulfilment permits forward stages but cannot go backwards or reopen completed orders", () => {
  statusChange("pending", "confirmed");
  statusChange("preparing", "cancelled");
  statusChange("pending", "delivered");
  assert.throws(() => statusChange("preparing", "confirmed"));
  assert.throws(() => statusChange("unknown", "confirmed"));
  assert.throws(() => statusChange("delivered", "pending"));
});
