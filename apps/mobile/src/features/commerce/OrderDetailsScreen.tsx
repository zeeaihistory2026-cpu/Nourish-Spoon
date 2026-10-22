import { AppNavigation } from "../../navigation/types";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useState } from "react";
import { View, Linking, Image } from "react-native";
import { choosePhoto } from "../../services/photos";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "../../components/AppTouchable";
import { GreenButton } from "../../components/DesignPrimitives";
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
import { watchOrders, watchOwnReviews, call, commerceError } from "./service";
import { useMobileStore } from "../../services/storeService";
import { OrderItems, OrderTotals, statusLabel } from "./OrderSummary";
import { downloadReceipt } from "./receiptDownload";
export function OrderDetailsScreen({
  navigation,
  orderId,
}: {
  navigation: AppNavigation;
  orderId: string;
}) {
  const { items, error, loading } = useAccountData(watchOrders);
  const { products, addToCart, settings, theme } = useMobileStore();
  const {
    items: ownReviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useAccountData(watchOwnReviews);
  const [message, setMessage] = useState(""),
    [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [productId, setProductId] = useState(""),
    [busy, setBusy] = useState(false);
  const order = items.find((item) => item.id === orderId);
  const submitted = ownReviews.filter((review) => review.order_id === orderId);
  const reviewableItems = [
    ...new Map(
      (order?.items ?? []).map((item) => [item.product_id, item]),
    ).values(),
  ].filter(
    (item) =>
      !submitted.some((review) => review.product_id === item.product_id),
  );
  const selectedProduct =
    reviewableItems.find((item) => item.product_id === productId) ??
    reviewableItems[0];
  const form = useFormValidation();
  const [photo, setPhoto] = useState<string>();
  const [choosingPhoto, setChoosingPhoto] = useState(false);
  const [downloading, setDownloading] = useState(false);
  async function receipt() {
    if (!order || downloading) return;
    setDownloading(true);
    setMessage("");
    try {
      const result = await call<{ filename: string; base64: string }>("getReceipt", { order_id: order.id });
      await downloadReceipt(result.filename, result.base64);
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setDownloading(false);
    }
  }
  async function attachPhoto() {
    if (choosingPhoto || busy) return;
    setChoosingPhoto(true);
    try {
      const selected = await choosePhoto();
      if (selected) setPhoto(selected);
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setChoosingPhoto(false);
    }
  }
  async function open(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      setMessage("Unable to open the link. Please try again.");
    }
  }
  async function review() {
    if (!order || !selectedProduct || reviewsLoading || busy) return;
    if (
      !form.validate(
        comment.trim()
          ? {}
          : { comment: "Write your review before submitting." },
      )
    )
      return;
    setBusy(true);
    try {
      await call("submitReview", {
        order_id: order.id,
        product_id: selectedProduct.product_id,
        rating,
        comment,
        ...(photo ? { photo } : {}),
      });
      setComment("");
      setPhoto(undefined);
      setMessage("Thank you! Your review is waiting for moderation.");
    } catch (error) {
      setMessage(commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      validationTick={form.validationTick}
      title="Order Details"
      back={navigation.goBack}
    >
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
            title={downloading ? "Preparing receipt…" : "Download Receipt"}
            disabled={downloading || order.quote_pending}
            onPress={receipt}
          />
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
              {reviewsLoading && <Copy>Loading your reviews…</Copy>}
              {!!reviewsError && <Message>{reviewsError}</Message>}
              {submitted.map((review) => (
                <Copy key={review.id}>
                  {review.product_name}:{" "}
                  {review.status === "approved"
                    ? "Published"
                    : review.status === "pending"
                      ? "Waiting for approval"
                      : "Received"}
                </Copy>
              ))}
              {!reviewsLoading && !reviewsError && !reviewableItems.length && (
                <Copy>Thank you for reviewing your purchase.</Copy>
              )}
              {!reviewsLoading && !!selectedProduct && (
                <>
                  {reviewableItems.map((item) => (
                    <Choice
                      key={item.product_id}
                      title={item.product_name}
                      selected={selectedProduct.product_id === item.product_id}
                      onPress={() => setProductId(item.product_id)}
                    />
                  ))}
                  <View
                    style={{ flexDirection: "row", gap: 6 }}
                    accessibilityLabel="Choose your star rating"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <TouchableOpacity
                        key={value}
                        accessibilityRole="button"
                        accessibilityLabel={`Rate ${value} ${value === 1 ? "star" : "stars"}`}
                        accessibilityState={{ selected: rating === value }}
                        style={{
                          minHeight: 44,
                          minWidth: 44,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => setRating(value)}
                      >
                        <Ionicons
                          name={value <= rating ? "star" : "star-outline"}
                          size={30}
                          color={theme.gold}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Field
                    label="Your review"
                    multiline
                    maxLength={1000}
                    value={comment}
                    {...form.bind("comment", setComment)}
                  />
                  <GreenButton
                    title={
                      choosingPhoto
                        ? "Preparing photo…"
                        : photo
                          ? "Change review photo"
                          : "Add a photo (optional)"
                    }
                    disabled={busy || choosingPhoto}
                    onPress={attachPhoto}
                  />
                  {photo && (
                    <>
                      <Image
                        source={{ uri: photo }}
                        resizeMode="contain"
                        style={{ width: "100%", height: 180, borderRadius: 12 }}
                        accessibilityLabel="Selected review photo"
                      />
                      <GreenButton
                        title="Remove photo"
                        disabled={busy}
                        onPress={() => setPhoto(undefined)}
                      />
                    </>
                  )}
                  <GreenButton
                    title={busy ? "Submitting…" : "Submit Review"}
                    disabled={busy || choosingPhoto}
                    onPress={review}
                  />
                </>
              )}
            </Card>
          )}
        </>
      )}
      {!!message && <Message>{message}</Message>}
    </Page>
  );
}
