import React from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { HeroCarousel } from "../components/HeroCarousel";
import { Header } from "../components/Header";
import { TrustBadges } from "../components/TrustBadges";
import { Text, ART, Rating } from "../components/DesignPrimitives";
import { useMobileStore } from "../services/storeService";
import { formatPKR } from "@packages/utils";
import { Product } from "@packages/types";
interface Props {
  onNavigateTab: (tab: string) => void;
  onSelectProduct: (p: Product) => void;
  onOpenWhatsAppOrder: (p?: Product) => void;
  onOpenDeliveryInfo: () => void;
  onOpenMenu: () => void;
  onAddToCart: (p: Product) => void;
  onOpenNotifications: () => void;
}
export function HomeScreen({
  onNavigateTab,
  onSelectProduct,
  onOpenWhatsAppOrder,
  onOpenDeliveryInfo,
  onOpenMenu,
  onAddToCart,
  onOpenNotifications,
}: Props) {
  const { theme: c, products, favorites, toggleFavorite } = useMobileStore();
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onOpenDeliveryInfo}
        style={[s.delivery, { backgroundColor: c.primaryDark }]}
      >
        <MaterialCommunityIcons
          name="truck-delivery"
          size={16}
          color="#F4C55D"
        />
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
            Same-day delivery in Sargodha
          </Text>
        <Ionicons name="chevron-forward" size={16} color="#fff" />
      </TouchableOpacity>
      <Header onMenu={onOpenMenu} onNotification={onOpenNotifications} />
      <HeroCarousel />
      <View style={s.hero}>
        <View style={s.heroCopy}>
          <View style={[s.eyebrow, { backgroundColor: c.goldWarm, borderColor: c.gold }]}>
            <Text style={{ color: c.gold, textAlign: "center", fontSize: 12, fontWeight: "700", letterSpacing: 0.5 }}>🌿 100% Natural · Handcrafted in Pakistan</Text>
          </View>
          <Text style={[s.heading, { color: c.text }]}>
            Handcrafted Nutrition.{"\n"}
            <Text style={{ color: c.gold, fontFamily: "serif", fontStyle: "italic", fontWeight: "400" }}>Real Ingredients.</Text>
            {"\n"}Pure Love.
          </Text>
          <Text style={[s.sub, { color: c.textSecondary }]}>
            Premium Panjeeri & Date-Nut Energy Balls made fresh in small batches. No preservatives, no shortcuts — just honest nourishment for your whole family.
          </Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Order on WhatsApp" onPress={() => onOpenWhatsAppOrder(products[0])} style={[s.order, { backgroundColor: c.whatsapp }]}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text numberOfLines={1} style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>Order Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onNavigateTab("Products")}
            style={[
              s.explore,
              { borderColor: c.gold },
            ]}
          >
            <Ionicons name="eye-outline" size={20} color={c.gold} />
            <Text style={{ color: c.gold, fontSize: 14, fontWeight: "700" }}>
              Explore Products
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingHorizontal: 12 }}>
        <TrustBadges variant="home" />
        <View style={{ width: "100%", aspectRatio: 1517 / 1041, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
          <Image source={require("../../assets/website/description-image.png")} style={{ width: "100%", height: "100%" }} resizeMode="contain" accessibilityLabel="Nourish Spoon energy balls and panjeeri" />
        </View>
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: c.text }]}>
            Our Signature Products
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab("Products")}>
            <Text style={{ fontSize: 11, color: c.primary, fontWeight: "700" }}>
              View All →
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {products
            .filter((p) => p.active)
            .slice(0, 2)
            .map((p) => (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={p.name}
                key={p.id}
                onPress={() => onSelectProduct(p)}
                style={[
                  s.card,
                  { backgroundColor: c.surface, borderColor: c.border },
                ]}
              >
                <View style={{ width: "100%", aspectRatio: 1.5 }}>
                  <Image
                    source={
                      p.category === "panjeeri"
                        ? ART.panjeeriCard
                        : ART.energyCard
                    }
                    style={s.cardImage}
                  />
                  <TouchableOpacity
                    accessibilityLabel={"Favorite " + p.name}
                    onPress={(event) => { event.stopPropagation(); toggleFavorite(p.id); }}
                    style={s.heart}
                  >
                    <Ionicons
                      name={
                        favorites.includes(p.id) ? "heart" : "heart-outline"
                      }
                      size={19}
                      color="#EF1747"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ padding: 9, flex: 1 }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: "serif",
                      color: c.text,
                      fontWeight: "700",
                      fontSize: 16,
                      lineHeight: 19,
                      minHeight: 38,
                    }}
                  >
                    {p.name}
                  </Text>
                  <Rating product={p} compact />
                  <Text
                    style={{
                      color: c.textSecondary,
                      fontSize: 11,
                      lineHeight: 15,
                      minHeight: 60,
                      flex: 1,
                    }}
                  >
                    {p.short_description}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
                    }}
                  >
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ color: c.textSecondary, fontSize: 10 }}>
                        From
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                        style={{
                          fontFamily: "serif",
                          color: c.primary,
                          fontWeight: "700",
                          fontSize: 15,
                        }}
                      >
                        {formatPKR(
                          p.variants[0].sale_price ??
                            p.variants[0].regular_price,
                        )}
                      </Text>
                    </View>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={"Add " + p.name + " to cart"}
                      onPress={(event) => { event.stopPropagation(); onAddToCart(p); }}
                      style={[s.cart, { backgroundColor: c.primaryDark }]}
                    >
                      <Ionicons name="cart-outline" size={21} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  delivery: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  hero: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 8 },
  heroCopy: { width: "100%", maxWidth: 520, alignSelf: "center", alignItems: "center" },
  eyebrow: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 24, borderWidth: 1, marginBottom: 14 },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 34,
    lineHeight: 37,
    textAlign: "center",
  },
  sub: { fontSize: 14, lineHeight: 23, marginTop: 14, marginBottom: 18, textAlign: "center" },
  order: { width: "100%", minHeight: 46, borderRadius: 8, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  explore: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 8,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 7,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    marginRight: 8,
    fontFamily: "serif",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  card: { flex: 1, borderRadius: 13, borderWidth: 1, overflow: "hidden" },
  cardImage: { width: "100%", height: "100%" },
  heart: {
    position: "absolute",
    right: 7,
    bottom: 6,
    width: 27,
    height: 27,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cart: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
