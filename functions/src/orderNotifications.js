/** Shared transactions already create their notice; the trigger handles legacy writes only. */
function orderNotification(
  before,
  after,
  orderId,
  now = new Date().toISOString(),
) {
  if (!before || !after) return null;
  if (after.last_notice_id && after.last_notice_id !== before.last_notice_id)
    return null;
  if (
    ["status", "payment_status", "tracking_number", "total"].every(
      (key) => before[key] === after[key],
    )
  )
    return null;
  return {
    order_id: orderId,
    title: `${after.order_number || orderId} updated`,
    body: `Order: ${String(after.status || "pending").replaceAll("_", " ")}. Payment: ${String(after.payment_status || "awaiting_payment").replaceAll("_", " ")}.`,
    created_at: now,
    read: false,
  };
}
module.exports = { orderNotification };
