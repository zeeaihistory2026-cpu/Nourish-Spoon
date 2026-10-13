import { AppNavigation } from "../../navigation/types";
import React, { useState } from "react";
import { View, Linking } from "react-native";
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
import { OrderItems, OrderTotals, statusLabel } from "./OrderSummary";
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
            <Copy>
              {statusLabel(order.status)} ·{" "}
              {new Date(order.created_at).toLocaleString()}
            </Copy>
            <OrderItems items={order.items} />
            <OrderTotals
              subtotal={order.subtotal}
              promoDiscount={order.promo_discount}
              rewardDiscount={order.reward_discount}
              fee={order.delivery_fee}
              total={order.total}
            />
            <Copy>
              Payment: {order.payment_status.replace(/_/g, " ")} ·{" "}
              {order.payment_method_code.replace(/_/g, " ")}
            </Copy>
            {order.is_gift && (
              <Copy>Gift message: {order.gift_message || "No message"}</Copy>
            )}
          </Card>
          <GreenButton
            title="Track Order"
            onPress={() => navigation.navigate("OrderTracking", { orderId })}
          />
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
