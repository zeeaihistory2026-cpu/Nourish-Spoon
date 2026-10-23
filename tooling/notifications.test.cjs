const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("../apps/mobile/node_modules/typescript");
function load(name, dependencies = {}) {
  const filename = path.resolve(
    "apps/mobile/src/features/commerce",
    name + ".ts",
  );
  const module = new Module(filename);
  module.require = (name) => {
    if (Object.hasOwn(dependencies, name)) return dependencies[name];
    throw Error("Unexpected dependency: " + name);
  };
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    filename,
  );
  return module.exports;
}
const presentation = load("notificationPresentation");
const notice = (body) => ({
  id: "notice",
  title: "Order updated",
  body,
  read: false,
  created_at: "2026-10-23T04:00:00Z",
});
test("notification history labels only the saved paid delivery as delivered and paid", () => {
  assert.equal(
    presentation.notificationActivity(
      notice("Order: delivered. Payment: paid."),
    ).title,
    "Delivered & paid",
  );
  const pending = presentation.notificationActivity(
    notice("Order: delivered. Payment: awaiting payment."),
  );
  assert.equal(pending.title, "Awaiting payment");
  assert.equal(pending.badge, "Pending");
  assert.equal(
    presentation.notificationActivity(
      notice("Order: out for delivery. Payment: awaiting payment."),
    ).title,
    "Out for delivery",
  );
  assert.equal(
    presentation.notificationActivity(
      notice("Order: delivered. Payment: unpaid."),
    ).title,
    "Delivered",
  );
  const announcement = {
    ...notice("Thank you for being part of Nourish Spoon."),
    title: "Goodness is on the way",
  };
  assert.equal(
    presentation.notificationActivity(announcement).title,
    announcement.title,
  );
});
test("notification summary uses only orders in the current account and dates use Pakistan time", () => {
  const own = [{ id: "newest" }, { id: "referenced" }];
  assert.equal(
    presentation.notificationOrder(
      [{ order_id: "unavailable" }, { order_id: "referenced" }],
      own,
    ).id,
    "referenced",
  );
  assert.equal(
    presentation.notificationOrder([{ order_id: "unavailable" }], own).id,
    "newest",
  );
  assert.equal(presentation.notificationOrder([], []), undefined);
  assert.match(presentation.notificationTime("2026-10-23T04:00:00Z"), /9:00/);
  assert.equal(presentation.notificationTime("invalid"), "");
});
function service(onCommit = () => {}) {
  const auth = { currentUser: { uid: "customer", isAnonymous: false } },
    batches = [];
  const firestore = {
    doc: (_, ...parts) => parts.join("/"),
    writeBatch: () => {
      const writes = [];
      batches.push(writes);
      return {
        update: (ref, data) => writes.push({ ref, data }),
        commit: async () => onCommit(auth, batches.length),
      };
    },
  };
  const result = load("service", {
    "./availability": { commerceEnabled: true },
    "firebase/functions": {},
    "firebase/firestore": firestore,
    "../../services/firebase": { db: {}, firebaseAuth: auth },
  });
  return { ...result, batches, auth };
}
test("mark all read deduplicates and chunks writes under the Firestore limit", async () => {
  const client = service(),
    ids = Array.from({ length: 805 }, (_, index) => "n" + index);
  await client.markNoticesRead([...ids, ids[0]]);
  assert.deepEqual(
    client.batches.map((batch) => batch.length),
    [400, 400, 5],
  );
  assert.equal(client.batches.flat().length, 805);
  assert.ok(
    client.batches
      .flat()
      .every(
        (write) =>
          write.ref.startsWith("users/customer/notifications/") &&
          Object.keys(write.data).join() === "read" &&
          write.data.read === true,
      ),
  );
});
test("mark all read stops when the signed-in account changes between batches", async () => {
  const client = service((auth) => {
    auth.currentUser = { uid: "different", isAnonymous: false };
  });
  await assert.rejects(
    client.markNoticesRead(
      Array.from({ length: 401 }, (_, index) => "n" + index),
    ),
    /account changed/,
  );
  assert.equal(client.batches.length, 1);
});
test("mark all read reports a failed batch and leaves the remaining writes for retry", async () => {
  const client = service(() => {
    throw Error("offline");
  });
  await assert.rejects(
    client.markNoticesRead(
      Array.from({ length: 401 }, (_, index) => "n" + index),
    ),
    /offline/,
  );
  assert.equal(client.batches.length, 1);
});
