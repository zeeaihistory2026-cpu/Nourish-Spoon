const { test } = require("node:test");
const assert = require("node:assert/strict");
const { orderNotification } = require("../src/orderNotifications");

test("shared order transactions do not produce a second trigger notification", () => {
  const before = { status: "pending", last_notice_id: "old" };
  const after = { status: "confirmed", last_notice_id: "atomic-notice" };
  assert.equal(orderNotification(before, after, "order"), null);
});

test("legacy status changes retain one notification and tolerate old missing fields", () => {
  const notice = orderNotification(
    { status: "pending" },
    { status: "confirmed", order_number: "NS-1" },
    "order",
    "2026-10-19T00:00:00Z",
  );
  assert.deepEqual(notice, {
    order_id: "order",
    title: "NS-1 updated",
    body: "Order: confirmed. Payment: awaiting payment.",
    created_at: "2026-10-19T00:00:00Z",
    read: false,
  });
});

test("unrelated changes do not notify but payment changes still do", () => {
  assert.equal(
    orderNotification(
      { status: "pending" },
      { status: "pending", updated_at: "later" },
      "order",
    ),
    null,
  );
  assert.ok(
    orderNotification(
      { status: "pending", payment_status: "submitted" },
      { status: "pending", payment_status: "paid" },
      "order",
    ),
  );
});
