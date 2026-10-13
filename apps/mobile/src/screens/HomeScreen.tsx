import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import { HomeHero } from "../components/HomeHero";
import { Header } from "../components/Header";
import { Text } from "../components/DesignPrimitives";
import { CompactProductCard } from "../components/CompactProductCard";
import { useMobileStore } from "../services/storeService";
import { PRODUCT_CATEGORIES } from "@packages/catalog/categories";
import { Product, ProductVariant } from "@packages/types";

interface Props {
  onSelectProduct: (product: Product) => void;
  onOpenMenu: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onOpenCart: () => void;
  onOpenCategory: (category: string) => void;
}
export function HomeScreen({
  onSelectProduct,
  onOpenMenu,
  onAddToCart,
  onOpenCart,
  onOpenCategory,
}: Props) {
  const { theme, products } = useMobileStore();
  const available = products.filter(
    (product) =>
      product.active && product.variants.some((variant) => variant.active),
  );
  const featured = [
    available.find((product) => product.category === "panjeeri"),
    available.find((product) => product.category === "energy_balls"),
  ].filter(Boolean) as Product[];
  const combos = available
    .filter((product) => product.category === "combos")
    .slice(0, 2);
  const section = (title: string, items: Product[], category: string) =>
    !items.length ? null : (
      <View style={s.section}>
        <View style={s.headingRow}>
          <Text style={s.heading}>{title}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`View all ${title.toLowerCase()}`}
            onPress={() => onOpenCategory(category)}
            style={s.viewAll}
          >
            <Text style={{ fontSize: 12, color: theme.primary }}>View All</Text>
            <Ionicons name="arrow-forward" size={15} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {items.map((product) => (
            <CompactProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAdd={onAddToCart}
            />
          ))}
        </View>
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      <Header onMenu={onOpenMenu} onCart={onOpenCart} rightAction="cart" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 6 }}
      >
        <HomeHero onShop={onOpenCategory} />
        <View style={s.categories}>
          {PRODUCT_CATEGORIES.filter((category) => category.id !== "all").map(
            (category) => (
              <TouchableOpacity
                key={category.id}
                accessibilityRole="button"
                accessibilityLabel={`Shop ${category.label}`}
                onPress={() => onOpenCategory(category.id)}
                style={s.category}
              >
                <View
                  style={[
                    s.categoryIcon,
                    {
                      backgroundColor: theme.surfaceWarm,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={theme.primary}
                  />
                </View>
                <Text style={{ fontSize: 12, textAlign: "center" }}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
        {section("Best Sellers", featured, "all")}
        {section("Combo Deals", combos, "combos")}
        {!available.length && (
          <Text style={{ fontSize: 14, textAlign: "center", padding: 20 }}>
            Products are currently unavailable. Contact Nourish Spoon in More.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  categories: { flexDirection: "row", paddingHorizontal: 12, marginBottom: 10 },
  category: { flex: 1, alignItems: "center", gap: 6, paddingVertical: 4 },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { paddingHorizontal: 12, marginBottom: 14 },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  heading: {
    flex: 1,
    fontFamily: "serif",
    fontSize: 24,
    lineHeight: 27,
    fontWeight: "700",
  },
  viewAll: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
