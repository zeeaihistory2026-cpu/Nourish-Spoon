import React, { useEffect, useState } from "react";
import { Purchase } from "@packages/types/commerce";
export function OrderEditor({
  order,
  busy,
  save,
}: {
  order: Purchase;
  busy: boolean;
  save: (patch: Record<string, unknown>) => void;
}) {
  const [status, setStatus] = useState(order.status),
    [payment, setPayment] = useState(order.payment_status),
    [tracking, setTracking] = useState(order.tracking_number),
    [fee, setFee] = useState(order.delivery_fee?.toString() || "");
  useEffect(() => {
    setStatus(order.status);
    setPayment(order.payment_status);
    setTracking(order.tracking_number);
    setFee(order.delivery_fee?.toString() || "");
  }, [order]);
  return (
    <article>
      <h3>{order.order_number}</h3>
      <p>
        {order.customer_name} · {order.customer_phone}
      </p>
      <p>
        {order.delivery_address}, {order.delivery_city}
      </p>
      <p>
        {order.items
          .map(
            (item) =>
              `${item.product_name} ${item.variant_weight} × ${item.quantity}`,
          )
          .join(" / ")}
      </p>
      <p>
        Products: PKR {order.subtotal.toLocaleString()} · Total:{" "}
        {order.total == null
          ? "Awaiting delivery quote"
          : "PKR " + order.total.toLocaleString()}
      </p>
      <div className="fields">
        <label>
          Order stage
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as Purchase["status"])
            }
          >
            {[
              "pending",
              "confirmed",
              "preparing",
              "out_for_delivery",
              "delivered",
              "cancelled",
            ].map((value) => (
              <option key={value} value={value}>
                {value.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          Payment
          <select
            value={payment}
            onChange={(event) =>
              setPayment(event.target.value as Purchase["payment_status"])
            }
          >
            {["awaiting_payment", "submitted", "paid", "refunded"].map(
              (value) => (
                <option key={value}>{value}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Delivery fee
          <input
            type="number"
            min="0"
            step="1"
            value={fee}
            onChange={(event) => setFee(event.target.value)}
          />
        </label>
        <label>
          TCS consignment number
          <input
            value={tracking}
            onChange={(event) => setTracking(event.target.value)}
            inputMode="numeric"
            maxLength={20}
          />
        </label>
      </div>
      <button
        disabled={busy}
        onClick={() =>
          save({
            status,
            payment_status: payment,
            tracking_number: tracking,
            ...(fee !== "" ? { delivery_fee: Number(fee) } : {}),
          })
        }
      >
        Save Order
      </button>
    </article>
  );
}
