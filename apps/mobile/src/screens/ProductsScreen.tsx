import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Product, ProductVariant } from "@packages/types";
import { PRODUCT_CATEGORIES } from "@packages/catalog/categories";
import { useMobileStore } from "../services/storeService";
import { Header } from "../components/Header";
import { Text } from "../components/DesignPrimitives";
import { TouchableOpacity } from "../components/AppTouchable";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/EmptyState";

type Props = {
  initialCategory?: string;
  favoritesOnly?: boolean;
  onBack: () => void;
  onBrowseProducts: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenWhatsAppOrder: (product: Product, variant?: ProductVariant) => void;
  onAddToCart: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
  ) => void;
};
export function ProductsScreen({
  initialCategory = "all",
  favoritesOnly = false,
  onBack,
  onBrowseProducts,
  onSelectProduct,
  onOpenWhatsAppOrder,
  onAddToCart,
}: Props) {
  const theme = useMobileStore((state) => state.theme);
  const products = useMobileStore((state) => state.products);
  const favorites = useMobileStore((state) => state.favorites);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const searchInput = useRef<TextInput>(null);
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  const query = search.trim().toLowerCase();
  const filtered = products.filter(
    (product) =>
      product.active &&
      product.variants.some((variant) => variant.active) &&
      (category === "all" || product.category === category) &&
      (!favoritesOnly || favorites.includes(product.id)) &&
      (!query ||
        (product.name + " " + product.short_description)
          .toLowerCase()
          .includes(query)),
  );
  const emptyWishlist = favoritesOnly && favorites.length === 0;
  const resetFilters = () => {
    setSearch("");
    setCategory("all");
  };
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <Header
        title={favoritesOnly ? "My Wishlist" : "Products"}
        showBack
        onBack={onBack}
        rightAction="search"
        onSearch={() => searchInput.current?.focus()}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filtered}
        keyExtractor={(product) => product.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.content}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <View>
            <View style={s.intro}>
              <Text accessibilityRole="header" style={s.heading}>
                {favoritesOnly ? "Saved for later" : "Goodness in every jar"}
              </Text>
              <Text style={[s.subtitle, { color: theme.textSecondary }]}>
                {favoritesOnly
                  ? "Your favourites, all in one place."
                  : "Handmade recipes. Carefully chosen ingredients."}
              </Text>
            </View>
            <View
              style={[
                s.search,
                { borderColor: theme.border, backgroundColor: theme.surface },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.textSecondary}
              />
              <TextInput
                ref={searchInput}
                accessibilityLabel="Search products"
                placeholder="Search recipes or ingredients"
                placeholderTextColor={theme.textSecondary}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                returnKeyType="search"
                style={[s.input, { color: theme.text }]}
              />
              {!!search && (
                <TouchableOpacity
                  accessibilityLabel="Clear search"
                  onPress={() => setSearch("")}
                  style={s.clear}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={s.categories}>
              {PRODUCT_CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: category === item.id }}
                  onPress={() => setCategory(item.id)}
                  style={[
                    s.category,
                    {
                      borderColor: theme.border,
                      backgroundColor:
                        category === item.id ? "#1B4332" : theme.surface,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: category === item.id ? "#fff" : theme.text,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text
              accessibilityLiveRegion="polite"
              style={[s.results, { color: theme.textSecondary }]}
            >
              {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
              {category !== "all"
                ? " in " +
                  PRODUCT_CATEGORIES.find((item) => item.id === category)?.label
                : " to explore"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={emptyWishlist ? "heart-outline" : "search-outline"}
            title={
              emptyWishlist
                ? "Make room for your favourites"
                : "Nothing matches just yet"
            }
            description={
              emptyWishlist
                ? "Tap the heart on a recipe to save it here."
                : "Try another search or explore all our recipes."
            }
            action={emptyWishlist ? "Browse Products" : "Reset Filters"}
            onAction={emptyWishlist ? onBrowseProducts : resetFilters}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onSelect={onSelectProduct}
            onAdd={onAddToCart}
            onWhatsApp={onOpenWhatsAppOrder}
          />
        )}
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  intro: { paddingTop: 6, paddingBottom: 20, gap: 6 },
  heading: {
    fontFamily: "serif",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "700",
  },
  subtitle: { fontSize: 13, lineHeight: 20 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 50,
    paddingLeft: 14,
    paddingRight: 4,
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    fontFamily: "Jost_400Regular",
    fontSize: 14,
    paddingVertical: 10,
  },
  clear: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 14 },
  category: {
    minHeight: 44,
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  results: { fontSize: 12, paddingTop: 18, paddingBottom: 12 },
});
