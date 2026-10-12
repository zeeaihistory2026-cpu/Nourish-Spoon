import { AppNavigation } from "../../navigation/types";
import React, { useState } from "react";
import { View, Linking } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import {
  Page,
  Card,
  Heading,
  Copy,
  Message,
  Field,
  Choice,
} from "./components";
import { useAccountData } from "./useAccountData";
import { watchOrders, call, commerceError } from "./service";
import { useMobileStore } from "../../services/storeService";
import { formatPKR } from "@packages/utils";
const stages = [
  ["pending", "Awaiting confirmation"],
  ["confirmed", "Order confirmed"],
  ["preparing", "Preparing your order"],
  ["out_for_delivery", "Dispatched"],
  ["delivered", "Delivered"],
];
export function OrderDetailsScreen({
  navigation,
  orderId,
}: {
  navigation: AppNavigation;
  orderId: string;
}) {
  const { items, error, loading } = useAccountData(watchOrders);
  const { products, addToCart, theme, settings } = useMobileStore();
  const order = items.find((item) => item.id === orderId);
  const [message, setMessage] = useState(""),
    [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [productId, setProductId] = useState(""),
    [busy, setBusy] = useState(false);
  async function open(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      setMessage("Unable to open the link. Please try again.");
    }
  }
  async function review() {
    if (!order || busy) return;
    if (!comment.trim()) {
      setMessage("Write your review before submitting.");
      return;
    }
    setBusy(true);
    try {
      await call("submitReview", {
        order_id: order.id,
        product_id: productId || order.items[0].product_id,
        rating,
        comment,
      });
      setComment("");
      setMessage("Thank you! Your review is waiting for moderation.");
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page title="Order Details" back={navigation.goBack}>
      {!!error && <Message>{error}</Message>}
      {loading && <Copy>Loading order…</Copy>}
      {!loading && !order && !error && (
        <Message>This order is unavailable for your account.</Message>
      )}
      {order && (
        <>
          <Card>
            <Heading>{order.order_number}</Heading>
            <Copy>
              {order.customer_name}
              {"\n"}
              {order.delivery_address}, {order.delivery_city}
              {"\n"}
              {order.customer_phone}
            </Copy>
            {order.items.map((item) => (
              <View
                key={item.variant_id}
                style={{
                  flexDirection: "row",
                  gap: 12,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ flex: 1 }}>
                  {item.product_name} · {item.variant_weight} × {item.quantity}
                </Text>
                <Text>{formatPKR(item.total_price)}</Text>
              </View>
            ))}
            <Copy>
              Products: {formatPKR(order.subtotal)}
              {"\n"}Delivery:{" "}
              {order.delivery_fee == null
                ? "Awaiting quote"
                : formatPKR(order.delivery_fee)}
              {"\n"}Total:{" "}
              {order.total == null
                ? "Awaiting confirmation"
                : formatPKR(order.total)}
              {"\n"}Payment: {order.payment_status.replace(/_/g, " ")}
            </Copy>
            {order.is_gift && (
              <Copy>Gift message: {order.gift_message || "No message"}</Copy>
            )}
          </Card>
          <Card>
            <Heading>Order progress</Heading>
            {order.status === "cancelled" ? (
              <Copy>This order was cancelled.</Copy>
            ) : (
              stages.map(([status, label], index) => (
                <View
                  key={status}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ color: theme.primary }}>
                    {index <=
                    stages.findIndex(([value]) => value === order.status)
                      ? "●"
                      : "○"}
                  </Text>
                  <Text>{label}</Text>
                </View>
              ))
            )}
          </Card>
          <Card>
            <Heading>TCS tracking</Heading>
            {order.tracking_number ? (
              <>
                <Copy>Consignment number: {order.tracking_number}</Copy>
                <GreenButton
                  title="Copy Tracking Number"
                  onPress={async () => {
                    try {
                      await Clipboard.setStringAsync(order.tracking_number);
                      setMessage("Tracking number copied.");
                    } catch {
                      setMessage("Could not copy the number.");
                    }
                  }}
                />
                <GreenButton
                  title="Open Official TCS Tracking"
                  onPress={() => open("https://www.tcsexpress.com/track/")}
                />
                <Copy>
                  Paste the consignment number on TCS. Delivery scans are shown
                  by TCS; the app’s order stages are updated by Nourish Spoon.
                </Copy>
              </>
            ) : (
              <Copy>
                {order.delivery_method_code === "tcs_nationwide"
                  ? "Your consignment number will appear after Nourish Spoon dispatches the parcel."
                  : "This order does not use TCS delivery."}
              </Copy>
            )}
          </Card>
          <Card>
            <GreenButton
              title="Order These Items Again"
              onPress={() => {
                let missing = false;
                order.items.forEach((item) => {
                  const product = products.find(
                    (p) => p.id === item.product_id && p.active,
                  );
                  const variant = product?.variants.find(
                    (v) => v.id === item.variant_id && v.active,
                  );
                  if (product && variant)
                    addToCart(product, variant, item.quantity);
                  else missing = true;
                });
                if (missing)
                  setMessage(
                    "Some items are no longer available. Available items were added to your cart.",
                  );
                else navigation.navigate("Cart");
              }}
            />
            <GreenButton
              title="Ask About This Order"
              whatsapp
              onPress={() =>
                open(
                  `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent("Hello! Please help with order " + order.order_number)}`,
                )
              }
            />
          </Card>
          {order.status === "delivered" && (
            <Card>
              <Heading>Review your purchase</Heading>
              {order.items.map((item) => (
                <Choice
                  key={item.product_id}
                  title={item.product_name}
                  selected={
                    (productId || order.items[0].product_id) === item.product_id
                  }
                  onPress={() => setProductId(item.product_id)}
                />
              ))}
              <View style={{ flexDirection: "row", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <View key={value} style={{ flex: 1 }}>
                    <Choice
                      title={`${value}★`}
                      selected={rating === value}
                      onPress={() => setRating(value)}
                    />
                  </View>
                ))}
              </View>
              <Field
                label="Your review"
                multiline
                maxLength={1000}
                value={comment}
                onChangeText={setComment}
              />
              <GreenButton
                title={busy ? "Submitting…" : "Submit Review"}
                disabled={busy}
                onPress={review}
              />
            </Card>
          )}
        </>
      )}
      {!!message && <Message>{message}</Message>}
    </Page>
  );
}
