import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMobileStore } from "../services/storeService";
import { Text, Botanical, Brand } from "./DesignPrimitives";
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onNotification?: () => void;
  onSearch?: () => void;
  onCart?: () => void;
  rightAction?: "bell" | "search" | "cart" | "none";
}
export function Header({
  title,
  showBack,
  onBack,
  onMenu,
  onNotification,
  onSearch,
  onCart,
  rightAction = "bell",
}: HeaderProps) {
  const { theme, cart } = useMobileStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <View style={[styles.header, { height: title ? 65 : 72 }]}>
      {title && <Botanical />}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={showBack ? "Go back" : "Open menu"}
        onPress={showBack ? onBack : onMenu}
        style={[styles.circle, { backgroundColor: theme.surface }]}
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
        <Brand website />
      )}
      {rightAction === "none" ? (
        <View style={{ width: 44 }} />
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            rightAction === "search"
              ? "Search products"
              : rightAction === "cart"
                ? "Open cart"
                : "Notifications"
          }
          onPress={
            rightAction === "search"
              ? onSearch
              : rightAction === "cart"
                ? onCart
                : onNotification
          }
          style={[styles.circle, { backgroundColor: theme.surface }]}
        >
          <Ionicons
            name={
              rightAction === "search"
                ? "search"
                : rightAction === "cart"
                  ? "bag-outline"
                  : "notifications-outline"
            }
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
    backgroundColor: "#1B4332",
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
