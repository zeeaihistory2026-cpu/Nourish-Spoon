import type { OrderNotice, Purchase } from "@packages/types/commerce";

export function notificationOrder(notices: OrderNotice[], orders: Purchase[]) {
  for (const notice of notices) {
    const order = orders.find((item) => item.id === notice.order_id);
    if (order) return order;
  }
  return orders[0];
}

/** Historical rows describe their saved event, never the order's current state. */
export function notificationActivity(notice: OrderNotice) {
  const status = /(?:^|\.\s*)Order:\s*([^.]+)/i
    .exec(notice.body)?.[1]
    .trim()
    .toLowerCase()
    .replaceAll("_", " ");
  const payment = /(?:^|\.\s*)Payment:\s*([^.]+)/i
    .exec(notice.body)?.[1]
    .trim()
    .toLowerCase()
    .replaceAll("_", " ");
  if (status === "cancelled")
    return {
      title: "Order cancelled",
      icon: "close-outline" as const,
      tone: "muted" as const,
    };
  if (status === "delivered" && payment === "paid")
    return {
      title: "Delivered & paid",
      icon: "checkmark-outline" as const,
      tone: "complete" as const,
    };
  if (status === "out for delivery")
    return {
      title: "Out for delivery",
      icon: "car-outline" as const,
      tone: "green" as const,
    };
  if (payment === "refunded")
    return {
      title: "Payment refunded",
      icon: "return-down-back-outline" as const,
      tone: "muted" as const,
    };
  if (status === "delivered" && payment === "awaiting payment")
    return {
      title: "Awaiting payment",
      icon: "card-outline" as const,
      tone: "gold" as const,
      badge: "Pending",
    };
  if (status === "delivered")
    return {
      title: "Delivered",
      icon: "checkmark-outline" as const,
      tone: "complete" as const,
    };
  if (payment === "paid")
    return {
      title: "Payment received",
      icon: "card-outline" as const,
      tone: "green" as const,
    };
  if (payment === "submitted")
    return {
      title: "Payment submitted",
      icon: "card-outline" as const,
      tone: "gold" as const,
      badge: "In review",
    };
  if (status === "confirmed" || status === "preparing")
    return {
      title:
        status === "confirmed" ? "Order confirmed" : "Preparing your order",
      icon: "cube-outline" as const,
      tone: "green" as const,
    };
  if (status === "pending")
    return {
      title: "Order placed",
      icon: "receipt-outline" as const,
      tone: "gold" as const,
    };
  return {
    title: notice.title,
    icon: notice.order_id
      ? ("receipt-outline" as const)
      : ("megaphone-outline" as const),
    tone: "green" as const,
  };
}

export const PAYMENT_LABELS: Record<Purchase["payment_status"], string> = {
  awaiting_payment: "Awaiting payment",
  submitted: "Payment in review",
  paid: "Paid",
  refunded: "Refunded",
};

export function notificationTime(value: string, date = false) {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return "";
  return parsed.toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    ...(date
      ? ({ day: "numeric", month: "short", year: "numeric" } as const)
      : ({ hour: "numeric", minute: "2-digit" } as const)),
  });
}
