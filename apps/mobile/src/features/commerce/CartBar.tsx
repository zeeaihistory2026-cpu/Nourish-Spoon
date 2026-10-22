import { BUTTON_COLORS, BUTTON_OUTLINE } from "../../constants/theme";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "../../components/AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, PriceText } from "../../components/DesignPrimitives";
import { useMobileStore } from "../../services/storeService";
import { formatPKR } from "@packages/utils";

/** A separate layout row keeps the cart shortcut clear of content and navigation. */
export function CartBar({ onOpen }: { onOpen: () => void }) {
  const { cart, theme, catalogueStatus } = useMobileStore();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      (item.variant.sale_price ?? item.variant.regular_price) * item.quantity,
    0,
  );
  if (!count || catalogueStatus !== "ready") return null;
  return (
    <View
      style={[
        s.container,
        { backgroundColor: theme.background, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${count} ${count === 1 ? "item" : "items"}, ${formatPKR(subtotal)} subtotal`}
        onPress={onOpen}
        style={s.button}
        activeOpacity={0.85}
      >
        <View style={s.quantity}>
          <Text style={s.count}>{count}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>
            {count} {count === 1 ? "item" : "items"}
          </Text>
          <PriceText style={s.subtotal}>{formatPKR(subtotal)}</PriceText>
        </View>
        <Text style={s.label}>View Cart</Text>
        <Ionicons name="arrow-forward" size={19} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
  button: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...BUTTON_OUTLINE,
    backgroundColor: BUTTON_COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantity: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF60",
    alignItems: "center",
    justifyContent: "center",
  },
  count: { color: "#fff", fontSize: 13, fontWeight: "700" },
  label: { color: "#fff", fontSize: 13, fontWeight: "700" },
  subtotal: { color: "#fff", fontSize: 12 },
});
