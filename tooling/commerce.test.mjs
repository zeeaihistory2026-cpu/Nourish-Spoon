import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from "firebase/functions";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
const require = createRequire(import.meta.url);
const { seed } = require("./seed-emulator.cjs");
const functionsRequire = createRequire(
  new URL("../functions/package.json", import.meta.url),
);
const { getFirestore } = functionsRequire("firebase-admin/firestore");
let customer, owner, server, order;
const config = {
  apiKey: "demo-key",
  projectId: "demo-nourish-spoon",
  appId: "demo-app",
};
function client(name) {
  const app = initializeApp(config, name);
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  return {
    app,
    auth,
    call: (name, data) =>
      httpsCallable(functions, name)(data).then((result) => result.data),
  };
}
const checkout = {
  request_id: "qa_order_request_001",
  items: [
    {
      product_id: "c0000000-0000-0000-0000-000000000001",
      variant_id: "d0000000-0000-0000-0000-000000000001",
      quantity: 2,
      unit_price: 1,
    },
  ],
  address: {
    name: "QA Customer",
    phone: "03001234567",
    city: "Chiniot",
    line: "Street 4",
  },
  delivery_method: "tcs_nationwide",
  payment_method: "bank_transfer",
};
before(async () => {
  server = await seed();
  customer = client("customer-test");
  owner = client("owner-test");
  await signInWithEmailAndPassword(
    customer.auth,
    "customer@example.invalid",
    "NourishQA!2026",
  );
  await signInWithEmailAndPassword(
    owner.auth,
    "info@nourishspoon.com",
    "NourishQA!2026",
  );
});
after(async () => {
  if (customer) await deleteApp(customer.app);
  if (owner) await deleteApp(owner.app);
  if (server) await server.delete();
});
test("checkout uses catalogue prices and retries do not duplicate orders", async () => {
  order = await customer.call("placeOrder", checkout);
  assert.equal(order.subtotal, 3998);
  assert.equal(order.total, 4248);
  assert.equal(order.delivery_city, "Chiniot");
  const retry = await customer.call("placeOrder", checkout);
  assert.equal(retry.id, order.id);
});
test("customer cannot approve payment, dispatch or review an undelivered order", async () => {
  await assert.rejects(
    customer.call("updateOrder", { id: order.id, payment_status: "paid" }),
  );
  await assert.rejects(
    customer.call("submitReview", {
      order_id: order.id,
      product_id: checkout.items[0].product_id,
      rating: 5,
      comment: "QA review",
    }),
  );
});
test("owner fulfils stages, supplies TCS and customer reviews once after delivery", async () => {
  await assert.rejects(
    owner.call("updateOrder", { id: order.id, status: "delivered" }),
  );
  await owner.call("updateOrder", {
    id: order.id,
    status: "confirmed",
    payment_status: "paid",
  });
  await owner.call("updateOrder", { id: order.id, status: "preparing" });
  await assert.rejects(
    owner.call("updateOrder", { id: order.id, status: "out_for_delivery" }),
  );
  await owner.call("updateOrder", {
    id: order.id,
    status: "out_for_delivery",
    tracking_number: "12345678901",
  });
  await owner.call("updateOrder", { id: order.id, status: "delivered" });
  const review = {
    order_id: order.id,
    product_id: checkout.items[0].product_id,
    rating: 5,
    comment: "QA fixture review",
  };
  const result = await customer.call("submitReview", review);
  assert.ok(result.id);
  await assert.rejects(customer.call("submitReview", review));
});
test("stock transaction prevents concurrent overselling and cancellation restores stock", async () => {
  const db = getFirestore(server),
    ref = db.doc("products/stock-test");
  await ref.set({
    name: "Stock test",
    active: true,
    variants: [
      {
        id: "stock-test-v",
        weight: "250g",
        active: true,
        regular_price: 100,
        stock: 3,
      },
    ],
  });
  const input = {
    ...checkout,
    items: [
      { product_id: "stock-test", variant_id: "stock-test-v", quantity: 2 },
    ],
  };
  const results = await Promise.allSettled(
    ["stock_request_0001", "stock_request_0002"].map((request_id) =>
      customer.call("placeOrder", { ...input, request_id }),
    ),
  );
  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );
  assert.equal((await ref.get()).data().variants[0].stock, 1);
  const completed = results.find(
    (result) => result.status === "fulfilled",
  ).value;
  await owner.call("updateOrder", { id: completed.id, status: "cancelled" });
  assert.equal((await ref.get()).data().variants[0].stock, 3);
});
test("social handoff requires correct verifier and cannot be replayed", async () => {
  const verifier = "a".repeat(64),
    challenge = createHash("sha256").update(verifier).digest("hex");
  const { code } = await customer.call("issueNativeSession", { challenge });
  await assert.rejects(
    customer.call("redeemNativeSession", { code, verifier: "b".repeat(64) }),
  );
  const result = await customer.call("redeemNativeSession", { code, verifier });
  assert.ok(result.token);
  await assert.rejects(
    customer.call("redeemNativeSession", { code, verifier }),
  );
});
