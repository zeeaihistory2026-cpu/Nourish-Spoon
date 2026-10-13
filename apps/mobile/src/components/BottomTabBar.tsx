import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import { useMobileStore } from "../services/storeService";
import { Text } from "./DesignPrimitives";
export type MobileTab = "Home" | "Products" | "Cart" | "Orders" | "More";
export function BottomTabBar({
  currentTab,
  activeTab,
  onSelectTab,
  navigation,
}: {
  currentTab?: MobileTab;
  activeTab?: MobileTab;
  onSelectTab?: (tab: MobileTab) => void;
  navigation?: any;
}) {
  const { theme, cart } = useMobileStore();
  const selected = activeTab || currentTab || "Home";
  const tabs: { id: MobileTab; icon: any; active: any }[] = [
    { id: "Home", icon: "home-outline", active: "home" },
    { id: "Products", icon: "bag-outline", active: "bag" },
    { id: "Cart", icon: "cart-outline", active: "cart" },
    { id: "Orders", icon: "receipt-outline", active: "receipt" },
    { id: "More", icon: "person-outline", active: "person" },
  ];
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.id}
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === t.id }}
          accessibilityLabel={t.id}
          onPress={() =>
            onSelectTab ? onSelectTab(t.id) : navigation?.navigate(t.id)
          }
          style={styles.tab}
        >
          <Ionicons
            name={selected === t.id ? t.active : t.icon}
            size={24}
            color={selected === t.id ? theme.primary : theme.textSecondary}
          />
          {t.id === "Cart" && cart.length > 0 && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: "23%",
                backgroundColor: "#1B4332",
                borderRadius: 10,
                minWidth: 16,
                paddingHorizontal: 3,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 10, color: "#fff" }}>
                {Math.min(
                  99,
                  cart.reduce((sum, item) => sum + item.quantity, 0),
                )}
              </Text>
            </View>
          )}
          <Text
            style={{
              fontSize: 11,
              marginTop: 3,
              color: selected === t.id ? theme.primary : theme.textSecondary,
              fontWeight: selected === t.id ? "700" : "400",
            }}
          >
            {t.id}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 7,
    paddingBottom: 5,
    minHeight: 58,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
});
