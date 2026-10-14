const { test } = require("node:test");
const assert = require("node:assert/strict");
const { normalizeProduct } = require("../lib/normalizeProduct");
const { priceOrder } = require("../src/domain");
test("empty legacy ingredient lists retain supplied display defaults", () => {
  const fallback = {
    ingredients: [{ slug: "khoya", name: "Khoya (milk)" }],
    nutrition_facts: [],
  };
  const recipe = normalizeProduct(
    "classic-panjeeri-with-sugar",
    { ingredients: [] },
    fallback,
  );
  assert.deepEqual(recipe.ingredients, fallback.ingredients);
  assert.deepEqual(recipe.nutrition_facts, []);
});
test("combo names classify separately and retain their own price and variant identity", () => {
  const combo = normalizeProduct("family-combo", {
    name: "Family Combo Panjeeri x Energy Balls",
    active: true,
    variants: [{ weight: "250g combo", regular_price: 3847 }],
  });
  const recipe = normalizeProduct("classic-panjeeri-with-sugar", {
    category: "panjeeri",
    active: true,
    variants: [{ weight: "250g", regular_price: 1648 }],
  });
  assert.equal(combo.category, "combos");
  assert.notEqual(combo.variants[0].id, recipe.variants[0].id);
  const order = priceOrder(
    [
      { product_id: combo.id, variant_id: combo.variants[0].id, quantity: 1 },
      { product_id: recipe.id, variant_id: recipe.variants[0].id, quantity: 1 },
    ],
    [combo, recipe],
    {},
    "self_pickup",
    false,
  );
  assert.equal(order.subtotal, 5495);
});
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

test("generic Panjeeri cards upgrade to website ingredients without changing server prices", () => {
  const fallback = {
    ingredients: [
      { slug: "almonds", name: "Almonds" },
      { slug: "semolina", name: "Semolina" },
    ],
    ingredient_notes: "Website recipe",
  };
  const recipe = normalizeProduct(
    "panjeeri",
    {
      category: "panjeeri",
      active: true,
      ingredients: [
        { slug: "nuts", name: "Nuts" },
        { slug: "seeds", name: "Seeds" },
      ],
      variants: [{ weight: "250g", regular_price: 1800 }],
    },
    fallback,
  );
  assert.deepEqual(recipe.ingredients, fallback.ingredients);
  assert.equal(recipe.ingredient_notes, "Website recipe");
  assert.equal(recipe.variants[0].regular_price, 1800);
  assert.equal(recipe.active, true);
  const published = [{ slug: "cashews", name: "Cashews" }];
  assert.deepEqual(
    normalizeProduct(
      "panjeeri",
      { category: "panjeeri", ingredients: published },
      fallback,
    ).ingredients,
    published,
  );
});
