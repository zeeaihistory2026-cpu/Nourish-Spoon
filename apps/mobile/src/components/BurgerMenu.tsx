import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, Brand } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

export type MenuSection = "payment" | "delivery";
export type MenuDestination =
  | MenuSection
  | "home"
  | "products"
  | "panjeeri"
  | "energy_balls"
  | "combos"
  | "story"
  | "reviews";
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
        destination: "reviews",
        title: "Customer Reviews",
        icon: "star-outline",
      },
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
  reduceMotion,
  onClose,
  onSelect,
}: {
  visible: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  onSelect: (destination: MenuDestination) => void;
}) {
  const { theme } = useMobileStore();
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType={reduceMotion ? "none" : "fade"}
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
          style={[s.panel, { backgroundColor: theme.background }]}
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
              <Ionicons name="close" size={25} color={theme.text} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}
          >
            {groups.map((group) => (
              <View key={group.label}>
                <Text
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: theme.textMuted,
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
                    style={[s.item, { borderColor: theme.borderSubtle }]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={theme.primary}
                    />
                    <Text style={s.label}>{item.title}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <View style={[s.banner, { backgroundColor: "#F5EADB" }]}>
              <Image
                source={require("../../assets/hero/panjeeri.png")}
                resizeMode="contain"
                style={{ width: "100%", height: 118 }}
              />
              <Text
                style={{
                  fontFamily: "serif",
                  fontSize: 22,
                  fontWeight: "700",
                  color: "#183320",
                  padding: 12,
                }}
              >
                Wholesome goodness.{"\n"}Crafted with Love.
              </Text>
            </View>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 12,
                lineHeight: 18,
                marginTop: 12,
              }}
            >
              Your profile, wishlist, addresses and updates are in More.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#00000070" },
  panel: { width: "86%", maxWidth: 340, flex: 1 },
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
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 50,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: { flex: 1, fontFamily: "serif", fontSize: 20, fontWeight: "700" },
  banner: { marginTop: 20, borderRadius: 14, overflow: "hidden" },
});
