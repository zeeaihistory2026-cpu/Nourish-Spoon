import { BUTTON_COLORS, BUTTON_OUTLINE } from "../constants/theme";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, Brand } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

import { MenuDestination } from "../navigation/types";
const groups: {
  label: string;
  items: {
    destination: MenuDestination;
    title: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }[];
}[] = [
  {
    label: "SHOP",
    items: [
      { destination: "home", title: "Home", icon: "home-outline" },
      { destination: "products", title: "All Products", icon: "grid-outline" },
      {
        destination: "panjeeri",
        title: "Homemade Panjeeri",
        icon: "leaf-outline",
      },
      {
        destination: "energy_balls",
        title: "Energy Balls",
        icon: "nutrition-outline",
      },
      { destination: "combos", title: "Combo Deals", icon: "gift-outline" },
    ],
  },
  {
    label: "NOURISH SPOON",
    items: [
      { destination: "story", title: "Our Story", icon: "flower-outline" },
      {
        destination: "delivery",
        title: "Delivery Information",
        icon: "car-outline",
      },
      {
        destination: "payment",
        title: "Payment Methods",
        icon: "card-outline",
      },
    ],
  },
];
export function BurgerMenu({
  visible,
  activeDestination,
  onClose,
  onSelect,
}: {
  visible: boolean;
  activeDestination?: MenuDestination;
  onClose: () => void;
  onSelect: (destination: MenuDestination) => void;
}) {
  const { theme } = useMobileStore();
  const { fontScale } = useWindowDimensions();
  const [bannerWidth, setBannerWidth] = React.useState(0);
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Dismiss menu"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView
          accessibilityViewIsModal
          style={[
            s.panel,
            { backgroundColor: theme.background, borderColor: theme.border },
          ]}
          edges={["top", "bottom"]}
        >
          <View style={s.top}>
            <Brand website />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              onPress={onClose}
              style={s.close}
            >
              <Ionicons name="close" size={23} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 6 }}
          >
            {groups.map((group) => (
              <View key={group.label}>
                <Text
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: theme.isDark ? theme.gold : "#A6862A",
                    marginTop: 20,
                    marginBottom: 6,
                  }}
                >
                  {group.label}
                </Text>
                {group.items.map((item) => (
                  <TouchableOpacity
                    key={item.destination}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    onPress={() => onSelect(item.destination)}
                    style={[
                      s.item,
                      item.destination === activeDestination && {
                        backgroundColor: theme.primary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={
                        item.destination === activeDestination
                          ? theme.isDark
                            ? theme.background
                            : "#FFFFFF"
                          : theme.primary
                      }
                    />
                    <Text
                      style={[
                        s.label,
                        { color: theme.text },
                        item.destination === activeDestination && {
                          color: theme.isDark ? theme.background : "#FFFFFF",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#B7AF99"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
          <View
            onLayout={(event) => setBannerWidth(event.nativeEvent.layout.width)}
            style={[
              s.banner,
              {
                backgroundColor: "#F5EADB",
                height: Math.max(160, 155 * fontScale),
              },
            ]}
          >
            <Image
              source={require("../../assets/hero/panjeeri.png")}
              resizeMode="contain"
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: bannerWidth / 2,
              }}
            />
            <LinearGradient
              colors={["#F5EADB", "rgba(245,234,219,0)"]}
              style={{
                position: "absolute",
                top: Math.max(160, 155 * fontScale) - bannerWidth / 2 - 1,
                left: 0,
                right: 0,
                height: 36,
              }}
            />
            <LinearGradient
              colors={[
                "#F5EADB",
                "rgba(245,234,219,0.7)",
                "rgba(245,234,219,0)",
              ]}
              locations={[0, 0.2, 0.65]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                width: "70%",
                gap: 7,
              }}
            >
              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                style={{
                  fontFamily: "serif",
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#183320",
                  lineHeight: 24,
                }}
              >
                Wholesome{"\n"}goodness.
              </Text>
              <Text
                style={{
                  color: "#805025",
                  fontSize: 12,
                }}
              >
                Crafted with Love.
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Shop Now"
                onPress={() => onSelect("products")}
                hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                style={{
                  alignSelf: "flex-start",
                  marginTop: 3,
                  minHeight: 32,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  ...BUTTON_OUTLINE,
                  backgroundColor: BUTTON_COLORS.background,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                >
                  Shop Now
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#00000070" },
  panel: {
    width: "86%",
    maxWidth: 340,
    flex: 1,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    borderRightWidth: 1,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 12,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C9A84C70",
    borderRadius: 22,
    backgroundColor: "#FFFFFF0F",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 2,
  },
  label: { flex: 1, fontSize: 15, color: "#FDF6E3" },
  banner: {
    marginTop: 10,
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 14,
    overflow: "hidden",
  },
});
