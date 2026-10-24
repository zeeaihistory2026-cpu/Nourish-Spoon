const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("../apps/mobile/node_modules/typescript");
const { createRequire } = require("node:module");
const mobileRequire = createRequire(
  path.resolve(__dirname, "../apps/mobile/package.json"),
);

function load(relative, dependencies = {}) {
  const filename = path.resolve(__dirname, "..", relative);
  const module = new Module(filename);
  module.require = (name) => {
    if (Object.hasOwn(dependencies, name)) return dependencies[name];
    return mobileRequire(name);
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
const { cartIssue, remainingCartQuantity, reconcileCart } = load(
  "apps/mobile/src/features/commerce/cart.ts",
);
const { readVerifiedCatalogue } = load(
  "apps/mobile/src/features/commerce/catalogueCache.ts",
);
const access = load("apps/mobile/src/navigation/access.ts");

test("every app destination requires a real signed-in account", () => {
  assert.equal(access.signedIn(null), false);
  assert.equal(access.signedIn({ uid: "guest", isAnonymous: true }), false);
  assert.equal(access.signedIn({ uid: "customer", isAnonymous: false }), true);
  for (const name of [
    "Home",
    "Products",
    "ProductDetail",
    "Cart",
    "Checkout",
    "Orders",
    "OrderDetails",
    "OrderTracking",
    "OrderConfirmation",
    "More",
    "About",
    "FAQ",
    "Reviews",
    "PaymentDelivery",
    "WhatsAppOrder",
    "Rewards",
    "Referrals",
    "Wishlist",
    "EditProfile",
    "Addresses",
    "Notifications",
    "TrackOrder",
    "TcsTracking",
    "onboarding",
    "FutureScreen",
  ]) {
    assert.deepEqual(access.accessibleRoute({ name }, false, true), {
      name: "Login",
    });
  }
  for (const name of ["Login", "Signup"])
    assert.deepEqual(access.accessibleRoute({ name }, false, true), { name });
});

test("auth restoration and logout cannot flash protected screens", () => {
  const order = { name: "OrderDetails", params: { orderId: "private-order" } };
  assert.deepEqual(access.accessibleRoute(order, true, false), {
    name: "splash",
  });
  assert.equal(access.accessibleRoute(order, true, true), order);
  assert.deepEqual(access.accessibleRoute(order, false, true), {
    name: "Login",
  });
});

test("new and returning customers reach the app only after authentication", () => {
  assert.deepEqual(access.entryRoute(false, false), { name: "Login" });
  assert.deepEqual(access.entryRoute(false, true), { name: "Login" });
  assert.deepEqual(access.entryRoute(true, false), { name: "onboarding" });
  assert.deepEqual(access.entryRoute(true, true), { name: "Home" });
});

test("product-card quantities respect per-size, shared-stock and cart limits", () => {
  const product = { id: "p", legacy_stock: 8 };
  const variant = { id: "v", stock: 6 };
  const cart = [
    { product, variant, quantity: 3 },
    { product, variant: { id: "other" }, quantity: 4 },
  ];
  assert.equal(remainingCartQuantity(product, variant, cart), 1);
  assert.equal(
    remainingCartQuantity({ id: "p" }, { id: "v", stock: null }, []),
    20,
  );
  assert.equal(
    remainingCartQuantity({ id: "p" }, { id: "v", stock: null }, [
      { product, variant, quantity: 20 },
    ]),
    0,
  );
  assert.equal(remainingCartQuantity(product, { ...variant, stock: 0 }, []), 0);
  assert.equal(
    remainingCartQuantity(product, variant, [
      { product, variant, quantity: 9 },
    ]),
    0,
  );
});
const checkoutSavings = load(
  "apps/mobile/src/features/commerce/checkoutSavings.ts",
);

test("checkout requires no coupon or points and only submits explicitly claimed savings", () => {
  assert.deepEqual(checkoutSavings.discountInput(null), {
    promo_code: "",
    reward_points: 0,
  });
  const quote = { promo_code: "PROMO10", points_redeemed: 100 };
  const key = checkoutSavings.savingsKey(
    [{ product_id: "p", variant_id: "v", quantity: 1 }],
    "self_pickup",
    "alice",
  );
  assert.equal(checkoutSavings.selectedSavings({ key, quote }, key), quote);
  assert.deepEqual(checkoutSavings.discountInput(quote), {
    promo_code: "PROMO10",
    reward_points: 100,
  });
  assert.equal(checkoutSavings.selectedSavings(null, key), null);
});

test("claimed savings become invalid when cart, delivery or account changes", () => {
  const items = [{ product_id: "p", variant_id: "v", quantity: 1 }];
  const key = checkoutSavings.savingsKey(items, "self_pickup", "alice");
  const applied = {
    key,
    quote: { promo_code: "PROMO10", points_redeemed: 100 },
  };
  for (const changedKey of [
    checkoutSavings.savingsKey(
      [{ ...items[0], quantity: 2 }],
      "self_pickup",
      "alice",
    ),
    checkoutSavings.savingsKey(items, "tcs_nationwide", "alice"),
    checkoutSavings.savingsKey(items, "self_pickup", "bob"),
  ])
    assert.deepEqual(
      checkoutSavings.discountInput(
        checkoutSavings.selectedSavings(applied, changedKey),
      ),
      { promo_code: "", reward_points: 0 },
    );
});

test("one-tap points claims respect balance, product total, coupon and program rules", () => {
  const rules = { enabled: true, point_value: 2, minimum_redemption: 100 };
  assert.equal(checkoutSavings.redeemablePoints(1000, 1000, 200, rules), 400);
  assert.equal(checkoutSavings.redeemablePoints(120, 1000, 200, rules), 120);
  assert.equal(checkoutSavings.redeemablePoints(99, 1000, 0, rules), 0);
  assert.equal(checkoutSavings.redeemablePoints(1000, 150, 0, rules), 0);
  assert.equal(
    checkoutSavings.redeemablePoints(1000, 1000, 0, {
      ...rules,
      enabled: false,
    }),
    0,
  );
});
const routes = load("apps/mobile/src/navigation/routes.ts", {
  "./types": load("apps/mobile/src/navigation/types.ts"),
});
test("detail screens retain the right shopping tab and information pages retain their origin", () => {
  assert.equal(
    routes.activeTabFor([{ name: "Home" }, { name: "ProductDetail" }]),
    "Products",
  );
  assert.equal(
    routes.activeTabFor([{ name: "More" }, { name: "About" }]),
    "More",
  );
  assert.equal(routes.activeTabFor([{ name: "Checkout" }]), "Cart");
  assert.equal(routes.activeTabFor([{ name: "OrderTracking" }]), "Orders");
  assert.equal(routes.activeTabFor([]), "Home");
});
test("drawer highlights only supported categories and information destinations", () => {
  assert.equal(
    routes.menuDestinationFor({
      name: "Products",
      params: { category: "combos" },
    }),
    "combos",
  );
  assert.equal(
    routes.menuDestinationFor({
      name: "Products",
      params: { category: "unknown" },
    }),
    "products",
  );
  assert.equal(
    routes.menuDestinationFor({
      name: "PaymentDelivery",
      params: { section: "payment" },
    }),
    "payment",
  );
  assert.equal(routes.menuDestinationFor({ name: "Checkout" }), undefined);
  assert.equal(routes.menuDestinationFor({ name: "Reviews" }), undefined);
});
const product = {
  id: "p",
  name: "Panjeeri",
  active: true,
  variants: [
    { id: "small", weight: "250g", active: true, stock: 3 },
    { id: "large", weight: "500g", active: true, stock: null },
  ],
};
const line = (variant = product.variants[0], quantity = 1) => ({
  product,
  variant,
  quantity,
});

test("cart validates current stock and aggregate legacy inventory across sizes", () => {
  assert.equal(cartIssue([line()], [product]), null);
  assert.match(cartIssue([line(undefined, 4)], [product]), /3 available/);
  assert.match(
    cartIssue(
      [line(undefined, 2), line(product.variants[1], 2)],
      [{ ...product, legacy_stock: 3 }],
    ),
    /across all sizes/,
  );
  assert.match(
    cartIssue([line()], [{ ...product, active: false }]),
    /unavailable/,
  );
  assert.match(cartIssue([line()], []), /unavailable/);
  assert.match(
    cartIssue([line(undefined, 1.5)], [product]),
    /between 1 and 20/,
  );
});

async function shoppingStore(saved) {
  const storage = new Map(
    saved ? [["nourish:shopping", JSON.stringify(saved)]] : [],
  );
  const auth = { currentUser: { uid: "alice", isAnonymous: false } };
  const snapshot = {
    INITIAL_PRODUCTS: [product],
    BRAND_IDENTITY: {},
    FOUNDER_STORY: {},
  };
  const { useMobileStore: store } = load(
    "apps/mobile/src/services/storeService.ts",
    {
      "./firebase": { firebaseAuth: auth },
      "@react-native-async-storage/async-storage": {
        getItem: async (key) => storage.get(key) ?? null,
        setItem: async (key, value) => storage.set(key, value),
        removeItem: async (key) => storage.delete(key),
      },
      "@packages/catalog/websiteSnapshot": snapshot,
      "../constants/theme": { LightTheme: {}, DarkTheme: {} },
      "../features/commerce/cart": { cartIssue, reconcileCart },
      "../features/commerce/catalogueCache": { readVerifiedCatalogue },
    },
  );
  await store.persist.rehydrate();
  return { store, storage, auth };
}

test("account changes clear both basket and wishlist, while the same owner retains them", async () => {
  const { store } = await shoppingStore();
  store.getState().setShoppingAccount("alice");
  store.getState().addToCart(product, product.variants[0], 2);
  store.getState().toggleFavorite("p");
  store.getState().setShoppingAccount("alice");
  assert.equal(store.getState().cart.length, 1);
  assert.deepEqual(store.getState().favorites, ["p"]);
  store.getState().setShoppingAccount("bob");
  assert.deepEqual(store.getState().cart, []);
  assert.deepEqual(store.getState().favorites, []);
});

test("hydration retains an owned basket but migrates an unowned legacy basket safely", async () => {
  const saved = {
    version: 1,
    state: { shoppingAccountId: "alice", cart: [line()], favorites: ["p"] },
  };
  const { store } = await shoppingStore(saved);
  store.getState().setShoppingAccount("alice");
  assert.equal(store.getState().cart.length, 1);
  store.getState().setShoppingAccount(null);
  assert.deepEqual(store.getState().cart, []);
  const legacy = await shoppingStore({ version: 0, state: saved.state });
  assert.deepEqual(legacy.store.getState().cart, []);
  assert.deepEqual(legacy.store.getState().favorites, []);
});

test("basket mutations reject overselling and anonymous additions", async () => {
  const { store, auth } = await shoppingStore();
  store.getState().addToCart(product, product.variants[0], 4);
  assert.equal(store.getState().cart.length, 0);
  store.getState().addToCart(product, product.variants[0], 2);
  store.getState().updateQuantity("small", 4);
  assert.equal(store.getState().cart[0].quantity, 2);
  auth.currentUser.isAnonymous = true;
  store.getState().addToCart(product, product.variants[0]);
  assert.equal(store.getState().cart[0].quantity, 2);
});

test("unverified Firestore cache stays hidden, while verified prices survive reconnects", async () => {
  const { store } = await shoppingStore();
  const listeners = [];
  let stopped = 0;
  const { subscribeCatalogue } = load(
    "apps/mobile/src/features/commerce/catalog.ts",
    {
      "firebase/firestore": {
        collection: (_db, name) => name,
        query: (value) => value,
        where: () => ({}),
        onSnapshot: (...args) => {
          listeners.push(args);
          return () => stopped++;
        },
      },
      "../../services/firebase": { db: {} },
      "../../services/storeService": { useMobileStore: store },
      "@packages/catalog/websiteSnapshot": {
        INITIAL_PRODUCTS: [product],
        INITIAL_REVIEWS: [],
      },
      "@packages/catalog/normalizeProduct": {
        normalizeProduct: (id, data) => ({ ...data, id }),
      },
    },
  );
  const stop = subscribeCatalogue();
  const [, options, next, fail] = listeners[0];
  assert.equal(options.includeMetadataChanges, true);
  const updated = {
    ...product,
    variants: [{ ...product.variants[0], regular_price: 1499 }],
  };
  const docs = [{ id: product.id, data: () => updated }];
  next({ empty: false, docs, metadata: { fromCache: true } });
  assert.equal(store.getState().catalogueStatus, "loading");
  assert.notEqual(store.getState().products[0].variants[0].regular_price, 1499);
  fail(new Error("offline"));
  assert.equal(store.getState().catalogueStatus, "error");
  next({ empty: false, docs, metadata: { fromCache: false } });
  assert.equal(store.getState().catalogueStatus, "ready");
  assert.equal(store.getState().products[0].variants[0].regular_price, 1499);
  fail(new Error("temporary reconnect"));
  assert.equal(store.getState().catalogueStatus, "ready");
  stop();
  assert.equal(stopped, 2);
});

test("simultaneous native token callbacks share one persistent installation identity", async () => {
  let generated = 0,
    writes = 0;
  const { installationId } = load(
    "apps/mobile/src/services/pushNotifications.ts",
    {
      "react-native": { Platform: { OS: "web" } },
      "expo-crypto": { randomUUID: () => `installation-${++generated}` },
      "@react-native-async-storage/async-storage": {
        getItem: async () => null,
        setItem: async () => {
          writes++;
        },
      },
      "../features/commerce/service": {
        call: () => {
          throw Error("unexpected network request");
        },
      },
    },
  );
  const ids = await Promise.all([
    installationId(),
    installationId(),
    installationId(),
  ]);
  assert.deepEqual(ids, ["installation-1", "installation-1", "installation-1"]);
  assert.equal(generated, 1);
  assert.equal(writes, 1);
});

test("server-verified catalogue restores immediately without accepting bundled or malformed prices", async () => {
  const first = await shoppingStore();
  const verified = {
    ...product,
    variants: [
      { ...product.variants[0], regular_price: 1499, sale_price: null },
    ],
  };
  first.store.getState().setProducts([verified]);
  const saved = JSON.parse(first.storage.get("nourish:shopping"));
  const restored = await shoppingStore(saved);
  assert.equal(restored.store.getState().catalogueStatus, "ready");
  assert.equal(
    restored.store.getState().products[0].variants[0].regular_price,
    1499,
  );
  const unverified = await shoppingStore({
    version: 1,
    state: { ...saved.state, catalogueVerifiedAt: null },
  });
  assert.equal(unverified.store.getState().catalogueStatus, "loading");
  const malformed = await shoppingStore({
    version: 1,
    state: { ...saved.state, products: [{ id: "bad" }] },
  });
  assert.equal(malformed.store.getState().catalogueStatus, "loading");
  assert.equal(readVerifiedCatalogue([verified], Date.now() + 3600000), null);
  const fresh = {
    ...verified,
    variants: [{ ...verified.variants[0], regular_price: 1799 }],
  };
  restored.store.getState().setProducts([fresh]);
  const merged = restored.store.persist
    .getOptions()
    .merge(saved.state, restored.store.getState());
  assert.equal(
    merged.products[0].variants[0].regular_price,
    1799,
    "A slower disk read cannot replace a fresh server response",
  );
  restored.store.getState().setProducts([]);
  const empty = await shoppingStore(
    JSON.parse(restored.storage.get("nourish:shopping")),
  );
  assert.equal(empty.store.getState().catalogueStatus, "ready");
  assert.deepEqual(empty.store.getState().products, []);
});
