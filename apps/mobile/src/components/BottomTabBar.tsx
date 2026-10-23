import { BUTTON_COLORS } from "../constants/theme";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMobileStore } from "../services/storeService";
import { Text } from "./DesignPrimitives";
import { MobileTab } from "../navigation/types";
export function BottomTabBar({
  activeTab,
  onSelectTab,
}: {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}) {
  const { theme, cart } = useMobileStore();
  const selected = activeTab;
  const tabs: {
    id: MobileTab;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    active: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
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
          onPress={() => onSelectTab(t.id)}
          style={styles.tab}
        >
          <View style={{ width: 32, height: 24, alignItems: "center" }}>
            <Ionicons
              name={selected === t.id ? t.active : t.icon}
              size={24}
              color={selected === t.id ? theme.primary : theme.textSecondary}
            />
          </View>
          {t.id === "Cart" && cart.length > 0 && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: "23%",
                backgroundColor: BUTTON_COLORS.background,
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
          <View
            style={{
              height: 2,
              width: 24,
              marginTop: 5,
              borderRadius: 2,
              backgroundColor: selected === t.id ? theme.gold : "transparent",
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 11,
    paddingBottom: 7,
    minHeight: 70,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
});
