import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PurchaseItem } from "@packages/types/commerce";
import { formatPKR } from "@packages/utils";
import { Text, PriceText } from "../../components/DesignPrimitives";
import { ProductArtwork } from "../../components/ProductArtwork";
import { useMobileStore } from "../../services/storeService";
import { Copy } from "./components";
export function OrderItems({
  items,
  detailed = false,
}: {
  items: PurchaseItem[];
  detailed?: boolean;
}) {
  const { products, theme } = useMobileStore();
  return (
    <>
      {items.map((item) => {
        const product = products.find(
          (product) => product.id === item.product_id,
        );
        return (
          <View
            key={item.variant_id}
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              borderBottomWidth: 1,
              borderColor: theme.borderSubtle,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                width: detailed ? 80 : 56,
                height: detailed ? 80 : 56,
                borderRadius: detailed ? 12 : 8,
                overflow: "hidden",
                backgroundColor: theme.surfaceWarm,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {product ? (
                <ProductArtwork product={product} />
              ) : (
                <Ionicons name="cube-outline" size={24} color={theme.primary} />
              )}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontSize: detailed ? 15 : 14,
                  lineHeight: 22,
                  fontWeight: "700",
                }}
              >
                {item.product_name}
              </Text>
              <Copy>
                {item.variant_weight} · ×{item.quantity}
              </Copy>
              {detailed && (
                <PriceText style={{ alignSelf: "flex-end" }}>
                  {formatPKR(item.total_price)}
                </PriceText>
              )}
            </View>
            {!detailed && (
              <PriceText
                style={{
                  fontSize: 14,
                  color: theme.isDark ? theme.gold : "#805025",
                }}
              >
                {formatPKR(item.total_price)}
              </PriceText>
            )}
          </View>
        );
      })}
    </>
  );
}
export function OrderTotals({
  subtotal,
  fee,
  total,
  promoDiscount = 0,
  rewardDiscount = 0,
  showTotal = true,
  amountColor,
}: {
  subtotal: number;
  fee: number | null;
  total: number | null;
  promoDiscount?: number;
  rewardDiscount?: number;
  showTotal?: boolean;
  amountColor?: string;
}) {
  const { theme } = useMobileStore();
  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Copy>Products subtotal</Copy>
        <PriceText style={{ color: amountColor || theme.gold }}>
          {formatPKR(subtotal)}
        </PriceText>
      </View>
      {!!promoDiscount && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Copy>Promo discount</Copy>
          <PriceText
            style={
              amountColor
                ? { color: theme.isDark ? theme.primary : "#00894C" }
                : undefined
            }
          >
            − {formatPKR(promoDiscount)}
          </PriceText>
        </View>
      )}
      {!!rewardDiscount && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Copy>Points discount</Copy>
          <PriceText
            style={
              amountColor
                ? { color: theme.isDark ? theme.primary : "#00894C" }
                : undefined
            }
          >
            − {formatPKR(rewardDiscount)}
          </PriceText>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Copy>Delivery charges</Copy>
        <PriceText style={{ color: amountColor || theme.gold }}>
          {fee == null ? "Awaiting quote" : formatPKR(fee)}
        </PriceText>
      </View>
      {showTotal && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: theme.surfaceWarm,
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Total Amount</Text>
          <PriceText style={{ fontWeight: "700", fontSize: 16 }}>
            {total == null ? "To be confirmed" : formatPKR(total)}
          </PriceText>
        </View>
      )}
    </View>
  );
}
export const ORDER_STAGES = [
  {
    status: "pending",
    label: "Order placed",
    copy: "Awaiting Nourish Spoon’s confirmation",
  },
  {
    status: "confirmed",
    label: "Order confirmed",
    copy: "Your order has been accepted",
  },
  {
    status: "preparing",
    label: "Processing",
    copy: "Preparing your handmade goodness",
  },
  {
    status: "out_for_delivery",
    label: "Dispatched",
    copy: "Your order has left Nourish Spoon",
  },
  {
    status: "delivered",
    label: "Delivered",
    copy: "Thank you for choosing Nourish Spoon",
  },
] as const;
export function statusLabel(status: string) {
  return status === "cancelled"
    ? "Cancelled"
    : ORDER_STAGES.find((stage) => stage.status === status)?.label || status;
}
