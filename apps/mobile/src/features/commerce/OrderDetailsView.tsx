import { ComponentProps, PropsWithChildren, useEffect, useRef } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Purchase } from "@packages/types/commerce";
import { formatPKR } from "@packages/utils";
import { Header } from "../../components/Header";
import { Text } from "../../components/DesignPrimitives";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Accordion } from "../../components/Accordion";
import { BUTTON_COLORS, BUTTON_OUTLINE } from "../../constants/theme";
import { useMobileStore } from "../../services/storeService";
import { Copy, Message } from "./components";
import { OrderItems, OrderTotals, statusLabel } from "./OrderSummary";

type Props = PropsWithChildren<{
  order?: Purchase;
  loading: boolean;
  error: string;
  message: string;
  downloading: boolean;
  validationTick: number;
  onBack: () => void;
  onReceipt: () => void;
  onReorder: () => void;
  onAsk: () => void;
  onTrack: () => void;
}>;

export function OrderDetailsView({
  order,
  loading,
  error,
  message,
  downloading,
  validationTick,
  onBack,
  onReceipt,
  onReorder,
  onAsk,
  onTrack,
  children,
}: Props) {
  const theme = useMobileStore((state) => state.theme);
  const methods = useMobileStore((state) => state.paymentMethods);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => {
    if (!validationTick) return;
    const frame = requestAnimationFrame(() =>
      scroll.current?.scrollToEnd({ animated: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [validationTick]);
  const payment =
    order &&
    {
      awaiting_payment: "Awaiting payment",
      submitted: "Payment submitted",
      paid: "Paid",
      refunded: "Refunded",
    }[order.payment_status];
  const method =
    order &&
    (methods.find((item) => item.code === order.payment_method_code)?.name ||
      order.payment_method_code.replace(/_/g, " "));

  return (
    <View style={{ flex: 1, backgroundColor: BUTTON_COLORS.background }}>
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <LinearGradient colors={[BUTTON_COLORS.background, "#082F28"]}>
          <Header inverse showBack onBack={onBack} />
          {order ? (
            <View style={s.hero}>
              <View
                style={[
                  s.status,
                  order.status === "cancelled" && {
                    backgroundColor: "#F5CDC5",
                  },
                ]}
              >
                <Text style={s.statusText}>{statusLabel(order.status)}</Text>
              </View>
              <Text style={s.date}>
                {new Date(order.created_at).toLocaleString("en-PK", {
                  day: "numeric",
                  month: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
                style={[s.total, order.total == null && { fontSize: 29 }]}
              >
                {order.total == null
                  ? "Awaiting quote"
                  : formatPKR(order.total)}
              </Text>
              <Text style={s.payment}>
                {payment} · {method}
              </Text>
              <Text style={s.orderNumber}>{order.order_number}</Text>
            </View>
          ) : (
            <View style={s.hero}>
              <Text
                accessibilityRole="header"
                style={[s.total, { fontSize: 32 }]}
              >
                Order details
              </Text>
            </View>
          )}
        </LinearGradient>
        <View style={[s.sheet, { backgroundColor: theme.background }]}>
          {!!error && <Message>{error}</Message>}
          {loading && (
            <View style={s.loading}>
              <ActivityIndicator color={theme.primary} />
              <Copy>Loading order…</Copy>
            </View>
          )}
          {!loading && !error && !order && (
            <Message>This order is unavailable for your account.</Message>
          )}
          {order && (
            <>
              <View
                style={[
                  s.summary,
                  {
                    backgroundColor: theme.isDark ? theme.surface : "#FFFEFB",
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <OrderItems detailed items={order.items} />
                <View style={{ paddingTop: 10 }}>
                  <OrderTotals
                    subtotal={order.subtotal}
                    promoDiscount={order.promo_discount}
                    rewardDiscount={order.reward_discount}
                    fee={order.delivery_fee}
                    total={order.total}
                    showTotal={false}
                    amountColor={theme.text}
                  />
                </View>
              </View>
              <View style={s.actions}>
                <OrderAction
                  icon="download-outline"
                  label={downloading ? "Preparing…" : "Receipt"}
                  busy={downloading}
                  disabled={downloading || order.quote_pending}
                  onPress={onReceipt}
                />
                <OrderAction
                  icon="refresh-outline"
                  label="Reorder"
                  onPress={onReorder}
                />
                <OrderAction
                  icon="logo-whatsapp"
                  label="Ask us"
                  whatsapp
                  onPress={onAsk}
                />
              </View>
              {!!message && (
                <Text
                  accessibilityLiveRegion="polite"
                  style={{ color: theme.text, fontSize: 14, lineHeight: 21 }}
                >
                  {message}
                </Text>
              )}
              <TouchableOpacity
                accessibilityLabel="Track Order"
                onPress={onTrack}
                style={[s.track, BUTTON_OUTLINE]}
              >
                <Ionicons
                  name="location-outline"
                  size={23}
                  color={BUTTON_COLORS.text}
                />
                <Text style={s.trackLabel}>Track Order</Text>
                <Ionicons
                  name="arrow-forward"
                  size={23}
                  color={BUTTON_COLORS.text}
                />
              </TouchableOpacity>
              <Accordion title="Order and delivery details">
                <Copy>
                  {order.customer_name}
                  {"\n"}
                  {order.delivery_address}, {order.delivery_city}
                  {"\n"}
                  {order.customer_phone}
                </Copy>
                {order.is_gift && (
                  <Copy>
                    Gift message: {order.gift_message || "No message"}
                  </Copy>
                )}
              </Accordion>
              {children}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function OrderAction({
  icon,
  label,
  onPress,
  disabled = false,
  busy = false,
  whatsapp = false,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  whatsapp?: boolean;
}) {
  const theme = useMobileStore((state) => state.theme);
  return (
    <TouchableOpacity
      accessibilityLabel={
        label === "Ask us" ? "Ask about this order on WhatsApp" : label
      }
      accessibilityState={{ busy, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        s.action,
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: whatsapp
            ? theme.isDark
              ? "#20452C"
              : "#E2F7DF"
            : theme.surface,
          borderColor: whatsapp
            ? theme.isDark
              ? "#3B6646"
              : "#BCE5B6"
            : theme.border,
        },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <Ionicons name={icon} size={25} color={theme.text} />
      )}
      <Text style={s.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 24, gap: 7 },
  status: {
    alignSelf: "flex-start",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: "#EBC062",
    marginBottom: 2,
  },
  statusText: { color: "#123D31", fontSize: 14, fontWeight: "600" },
  date: { color: "#F0F6EE", fontSize: 14, lineHeight: 21 },
  total: { color: "#FFFFFF", fontSize: 43, lineHeight: 58, fontWeight: "700" },
  payment: { color: "#F0F6EE", fontSize: 15, lineHeight: 23 },
  orderNumber: { color: "#B9D2C5", fontSize: 11, lineHeight: 16 },
  sheet: {
    flexGrow: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 16,
    paddingBottom: 24,
    gap: 17,
  },
  summary: { padding: 15, borderRadius: 20, borderWidth: 1 },
  actions: { flexDirection: "row", gap: 10 },
  action: {
    flex: 1,
    minWidth: 0,
    minHeight: 86,
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { fontSize: 14, fontWeight: "500", textAlign: "center" },
  track: {
    minHeight: 50,
    backgroundColor: BUTTON_COLORS.background,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
    padding: 12,
    marginTop: 17,
  },
  trackLabel: { color: BUTTON_COLORS.text, fontSize: 16, fontWeight: "600" },
  loading: { paddingVertical: 35, gap: 14, alignItems: "center" },
});
