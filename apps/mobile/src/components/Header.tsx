import { BUTTON_COLORS } from "../constants/theme";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMobileStore } from "../services/storeService";
import { Text, Botanical, Brand } from "./DesignPrimitives";
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onSearch?: () => void;
  onCart?: () => void;
  rightAction?: "search" | "cart" | "none";
  premium?: boolean;
}
export function Header({
  title,
  showBack,
  onBack,
  onMenu,
  onSearch,
  onCart,
  rightAction = "none",
  premium = false,
}: HeaderProps) {
  const { theme, cart } = useMobileStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <View
      style={[
        styles.header,
        { minHeight: title ? 65 : premium ? 82 : 72 },
        premium && { backgroundColor: theme.background },
      ]}
    >
      {title && <Botanical />}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={showBack ? "Go back" : "Open menu"}
        onPress={showBack ? onBack : onMenu}
        style={[
          styles.circle,
          { backgroundColor: premium ? theme.surfaceWarm : theme.surface },
        ]}
      >
        <Ionicons
          name={showBack ? "chevron-back" : "menu"}
          size={25}
          color={theme.text}
        />
      </TouchableOpacity>
      {title ? (
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      ) : (
        <Brand website large={premium} />
      )}
      {rightAction === "none" ? (
        <View style={{ width: 44 }} />
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            rightAction === "search" ? "Search products" : "Open cart"
          }
          onPress={rightAction === "search" ? onSearch : onCart}
          style={[
            styles.circle,
            { backgroundColor: premium ? theme.surfaceWarm : theme.surface },
          ]}
        >
          <Ionicons
            name={rightAction === "search" ? "search" : "bag-outline"}
            size={23}
            color={theme.text}
          />
          {rightAction === "cart" && cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "serif",
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  cartBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: BUTTON_COLORS.background,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
