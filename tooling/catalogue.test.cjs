const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("../apps/mobile/node_modules/typescript");
const root = path.resolve(__dirname, "..");
const cache = new Map();
function load(relative) {
  const filename = path.join(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = new Module(filename);
  cache.set(filename, module);
  module.require = (name) => {
    if (name === "firebase/firestore") return {};
    if (name === "../../services/firebase") return { db: null };
    if (name === "../../services/storeService") return {};
    if (name === "@packages/catalog/websiteSnapshot")
      return load("packages/catalog/websiteSnapshot.ts");
    if (name === "@packages/catalog/normalizeProduct")
      return load("packages/catalog/normalizeProduct.js");
    if (name === "./receivedProducts")
      return load("packages/catalog/receivedProducts.ts");
    if (name === "./websiteReviews.json")
      return JSON.parse(
        fs.readFileSync(
          path.join(root, "packages/catalog/websiteReviews.json"),
        ),
      );
    throw Error("Unexpected dependency: " + name);
  };
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
  return module.exports;
}
const { INITIAL_PRODUCTS } = load("packages/catalog/websiteSnapshot.ts");
const { mergeCatalogueDocuments } = load(
  "apps/mobile/src/features/commerce/catalog.ts",
);
const document = (id, data) => ({ id, data: () => data });
test("the actual legacy-only live catalogue keeps Energy Balls and all received products visible", () => {
  const products = mergeCatalogueDocuments([
    document("date-nut-balls", {
      name: "Date & Nuts Energy Balls",
      slug: "date-nut-balls",
      isActive: true,
    }),
    document("homemade-panjeeri", {
      name: "Homemade Panjeeri",
      slug: "homemade-panjeeri",
      isActive: true,
    }),
  ]);
  assert.equal(products.length, 9);
  const energy = products.filter(
    (product) => product.category === "energy_balls",
  );
  assert.equal(energy.length, 1);
  assert.equal(energy[0].id, "date-and-nuts-energy-balls");
  assert.deepEqual(
    energy[0].variants.map((variant) => variant.weight),
    ["250g", "500g"],
  );
  assert.equal(
    products.filter((product) => product.category === "panjeeri").length,
    2,
  );
  assert.equal(
    products.filter((product) => product.category === "combos").length,
    6,
  );
});
test("a published canonical Energy Balls SKU supplies server prices exactly once", () => {
  const energy = INITIAL_PRODUCTS.find(
    (product) => product.category === "energy_balls",
  );
  const products = mergeCatalogueDocuments([
    document(energy.id, {
      ...energy,
      variants: [{ ...energy.variants[0], regular_price: 2300 }],
    }),
  ]);
  const matches = products.filter((product) => product.name === energy.name);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].variants[0].regular_price, 2300);
});
test("an intentionally inactive canonical SKU stays hidden instead of resurrecting its fallback", () => {
  const energy = INITIAL_PRODUCTS.find(
    (product) => product.category === "energy_balls",
  );
  const products = mergeCatalogueDocuments([
    document(energy.id, { ...energy, active: false }),
  ]);
  assert.equal(
    products.some((product) => product.id === energy.id),
    false,
  );
});
