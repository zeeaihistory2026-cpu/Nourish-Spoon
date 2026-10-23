import { View, Image, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HomeHero } from "../components/HomeHero";
import { Header } from "../components/Header";
import { Text } from "../components/DesignPrimitives";
import { ProductCard } from "../components/ProductCard";
import { useMobileStore } from "../services/storeService";
import { PRODUCT_CATEGORIES } from "@packages/catalog/categories";
import { Product, ProductVariant } from "@packages/types";
import { TrustBadges } from "../components/TrustBadges";
import { ASSETS } from "../constants/assets";

interface Props {
  onSelectProduct: (product: Product) => void;
  onOpenMenu: () => void;
  onAddToCart: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
  ) => void;
  onOpenNotifications: () => void;
  onOpenCategory: (category: string) => void;
}
export function HomeScreen({
  onSelectProduct,
  onOpenMenu,
  onAddToCart,
  onOpenNotifications,
  onOpenCategory,
}: Props) {
  const theme = useMobileStore((state) => state.theme);
  const products = useMobileStore((state) => state.products);
  const available = products.filter(
    (product) =>
      product.active && product.variants.some((variant) => variant.active),
  );
  const featured = [
    available.find((product) => product.category === "panjeeri"),
    available.find((product) => product.category === "energy_balls"),
  ].filter(Boolean) as Product[];
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
            <Text style={{ fontSize: 13, color: theme.gold }}>View All</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.gold} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {items.map((product) => (
            <ProductCard
              compact
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
      <Header
        premium
        onMenu={onOpenMenu}
        onNotifications={onOpenNotifications}
        rightAction="notifications"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <HomeHero onShop={onOpenCategory} />
        <View
          style={[
            s.categories,
            {
              backgroundColor: theme.isDark ? theme.surface : "#FFFCF6",
              shadowColor: theme.primaryDark,
            },
          ]}
        >
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
                      borderColor:
                        category.id === "panjeeri"
                          ? "#D4A450"
                          : theme.borderSubtle,
                    },
                  ]}
                >
                  <Image
                    source={
                      category.id === "panjeeri"
                        ? ASSETS.categoryPanjeeri
                        : category.id === "combos"
                          ? ASSETS.categoryGift
                          : ASSETS.categoryEnergyBalls
                    }
                    style={s.categoryPhoto}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
        <View style={s.trust}>
          <TrustBadges variant="home" />
        </View>
        {section("Best Sellers", featured, "all")}
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
  categories: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginTop: -14,
    marginBottom: 14,
    borderRadius: 36,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  category: { flex: 1, alignItems: "center", gap: 7, paddingVertical: 2 },
  categoryIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  categoryPhoto: { width: "100%", height: "100%", resizeMode: "contain" },
  trust: { paddingHorizontal: 12, marginBottom: 16 },
  section: { paddingHorizontal: 16 },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  heading: {
    flex: 1,
    fontFamily: "serif",
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "700",
  },
  viewAll: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
