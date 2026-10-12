import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PurchaseItem } from "@packages/types/commerce";
import { formatPKR } from "@packages/utils";
import { Text } from "../../components/DesignPrimitives";
import { ProductArtwork } from "../../components/ProductArtwork";
import { useMobileStore } from "../../services/storeService";
import { Copy } from "./components";
export function OrderItems({ items }: { items: PurchaseItem[] }) {
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
                width: 56,
                height: 56,
                borderRadius: 8,
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
              <Text style={{ fontSize: 14, fontWeight: "700" }}>
                {item.product_name}
              </Text>
              <Copy>
                {item.variant_weight} · ×{item.quantity}
              </Copy>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: theme.isDark ? theme.gold : "#805025",
              }}
            >
              {formatPKR(item.total_price)}
            </Text>
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
}: {
  subtotal: number;
  fee: number | null;
  total: number | null;
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
        <Text>{formatPKR(subtotal)}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Copy>Delivery charges</Copy>
        <Text>{fee == null ? "Awaiting quote" : formatPKR(fee)}</Text>
      </View>
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
        <Text style={{ fontWeight: "700", fontSize: 16 }}>
          {total == null ? "To be confirmed" : formatPKR(total)}
        </Text>
      </View>
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
