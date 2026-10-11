import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, Brand } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

export type MenuSection = "payment" | "delivery";

export function BurgerMenu({ visible, reduceMotion, onClose, onSelect }: {
  visible: boolean;
  reduceMotion: boolean;
  onClose: () => void;
  onSelect: (section: MenuSection) => void;
}) {
  const { theme } = useMobileStore();
  const items = [
    { section: "delivery" as const, title: "Delivery Information", description: "Delivery areas, timing and charges", icon: "car-outline" as const },
    { section: "payment" as const, title: "Payment Methods", description: "Bank transfer, Easypaisa and JazzCash", icon: "card-outline" as const },
  ];
  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType={reduceMotion ? "none" : "fade"} onRequestClose={onClose}>
      <View style={s.backdrop}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dismiss menu" onPress={onClose} style={StyleSheet.absoluteFill} />
        <SafeAreaView accessibilityViewIsModal style={[s.panel, { backgroundColor: theme.background }]} edges={["top", "bottom"]}>
          <View style={s.top}>
            <Text accessibilityRole="header" style={{ fontFamily: "serif", fontWeight: "700", fontSize: 28, color: theme.text }}>Menu</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close menu" onPress={onClose} style={s.close}>
              <Ionicons name="close" size={25} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}><Brand website /></View>
          {items.map(item => (
            <TouchableOpacity key={item.section} accessibilityRole="button" accessibilityLabel={item.title} onPress={() => onSelect(item.section)} style={[s.item, { borderColor: theme.border }]}>
              <View style={[s.icon, { backgroundColor: theme.goldWarm }]}><Ionicons name={item.icon} size={24} color={theme.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: theme.text }}>{item.title}</Text>
                <Text style={{ fontSize: 12, lineHeight: 17, color: theme.textSecondary, marginTop: 3 }}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }} />
          <Text style={{ color: theme.textSecondary, textAlign: "center", fontSize: 12, padding: 20 }}>Crafted with Love · Nourish Spoon</Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#00000070" },
  panel: { width: "85%", maxWidth: 340, flex: 1 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 20, paddingRight: 10 },
  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  item: { flexDirection: "row", alignItems: "center", gap: 10, padding: 16, borderTopWidth: 1 },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
