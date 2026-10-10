import { Text } from "../components/DesignPrimitives";
import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { useMobileStore } from "../services/storeService";
import { ASSETS } from "../constants/assets";
import { formatPKR } from "@packages/utils";
import { Product, ProductVariant } from "@packages/types";

interface ProductsScreenProps {
  onBack: () => void;
  onSelectProduct: (prod: Product) => void;
  onOpenWhatsAppOrder: (prod: Product, variant?: ProductVariant) => void;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  onBack,
  onSelectProduct,
  onOpenWhatsAppOrder,
}) => {
  const { width } = useWindowDimensions();
  const { theme, products, favorites, toggleFavorite } = useMobileStore();
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Energy Balls" | "Panjeeri"
  >("All");
  const searchRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({
    "c0000000-0000-0000-0000-000000000001": "250g",
    "c0000000-0000-0000-0000-000000000002": "250g",
  });

  const categories: Array<"All" | "Energy Balls" | "Panjeeri"> = [
    "All",
    "Energy Balls",
    "Panjeeri",
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "All" ||
      (selectedCategory === "Energy Balls" && p.category === "energy_balls") ||
      (selectedCategory === "Panjeeri" && p.category === "panjeeri");

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Header
        title="Products"
        showBack
        onBack={onBack}
        rightAction="search"
        onSearch={() => searchRef.current?.focus()}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar Input */}
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.textMuted}
            style={{ marginRight: 8 }}
          />
          <TextInput
            ref={searchRef}
            accessibilityLabel="Search products"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <View style={styles.categoriesRow}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.catPill,
                  isActive
                    ? { backgroundColor: theme.primary }
                    : {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        borderWidth: 1,
                      },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.catPillText,
                    { color: isActive ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Product Cards List */}
        <View style={styles.productsList}>
          {filteredProducts.length === 0 && (
            <Text
              style={{
                color: theme.textSecondary,
                paddingVertical: 30,
                textAlign: "center",
              }}
            >
              No products match your search.
            </Text>
          )}
          {filteredProducts.map((prod) => {
            const isFav = favorites.includes(prod.id);
            const activeWeight = selectedVariants[prod.id] || "250g";
            const currentVariant =
              prod.variants.find((v) => v.weight === activeWeight) ||
              prod.variants[0];

            return (
              <View
                key={prod.id}
                style={[
                  styles.card,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                {/* Wide Product Hero Image */}
                <TouchableOpacity
                  onPress={() => onSelectProduct(prod)}
                  activeOpacity={0.9}
                  style={styles.cardImageWrapper}
                >
                  <Image
                    source={
                      prod.name.includes("Energy")
                        ? require("../../assets/design/energy-catalog.jpg")
                        : require("../../assets/design/panjeeri-catalog.jpg")
                    }
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => toggleFavorite(prod.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Favorite ${prod.name}`}
                    accessibilityState={{ selected: isFav }}
                    style={styles.favCircle}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={18}
                      color="#E11D48"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Card Content */}
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>
                    {prod.name}
                  </Text>

                  {/* Rating */}
                  <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={13}
                          color="#C99B36"
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingScore}>
                      {prod.rating}{" "}
                      <Text style={styles.reviewCount}>
                        ({prod.review_count} reviews)
                      </Text>
                    </Text>
                  </View>

                  <Text
                    style={[styles.cardDesc, { color: theme.textSecondary }]}
                  >
                    {prod.short_description}
                  </Text>

                  {/* Weight Selector Boxes */}
                  <View style={styles.variantsRow}>
                    {prod.variants.map((variant) => {
                      const isSelected = activeWeight === variant.weight;
                      return (
                        <TouchableOpacity
                          key={variant.id}
                          onPress={() =>
                            setSelectedVariants({
                              ...selectedVariants,
                              [prod.id]: variant.weight,
                            })
                          }
                          style={[
                            styles.variantBox,
                            {
                              borderColor: isSelected
                                ? theme.primary
                                : theme.border,
                            },
                            isSelected && {
                              backgroundColor:
                                theme.mode === "light" ? "#F0F9F3" : "#143622",
                            },
                          ]}
                          activeOpacity={0.85}
                        >
                          <View>
                            <Text
                              style={[
                                styles.variantWeight,
                                { color: theme.textSecondary },
                              ]}
                            >
                              {variant.weight}
                            </Text>
                            <Text
                              style={[
                                styles.variantPrice,
                                { color: theme.text },
                              ]}
                            >
                              {formatPKR(
                                variant.sale_price || variant.regular_price,
                              )}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.radioCircle,
                              {
                                borderColor: isSelected
                                  ? theme.primary
                                  : theme.border,
                              },
                            ]}
                          >
                            {isSelected && (
                              <View
                                style={[
                                  styles.radioDot,
                                  { backgroundColor: theme.primary },
                                ]}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Actions Row: WhatsApp (Dominant) + View Product + Cart */}
                  <View
                    style={[
                      styles.actionsRow,
                      width < 380 && { flexWrap: "wrap" },
                    ]}
                  >
                    {/* Primary WhatsApp Order CTA */}
                    <TouchableOpacity
                      onPress={() => onOpenWhatsAppOrder(prod, currentVariant)}
                      style={[
                        styles.whatsappButton,
                        { backgroundColor: theme.primary },
                        width < 380 && { flexBasis: "100%" },
                      ]}
                      activeOpacity={0.85}
                    >
                      <FontAwesome
                        name="whatsapp"
                        size={18}
                        color="#FFFFFF"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.whatsappButtonText}>
                        Order on WhatsApp →
                      </Text>
                    </TouchableOpacity>

                    {/* Secondary View Product CTA */}
                    <TouchableOpacity
                      onPress={() => onSelectProduct(prod)}
                      style={[
                        styles.viewProductButton,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.surfaceWarm,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Feather
                        name="file-text"
                        size={14}
                        color={theme.text}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[styles.viewProductText, { color: theme.text }]}
                      >
                        View Product
                      </Text>
                    </TouchableOpacity>

                    {/* Cart Button */}
                    <TouchableOpacity
                      onPress={() => onOpenWhatsAppOrder(prod, currentVariant)}
                      style={[
                        styles.cartSquare,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.surfaceWarm,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="cart-outline"
                        size={18}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  searchInput: {
    minWidth: 0,
    fontFamily: "Lato_400Regular",
    flex: 1,
    fontSize: 13,
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  catPill: {
    paddingVertical: 7,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  catPillText: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  productsList: {
    gap: 16,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImageWrapper: {
    aspectRatio: 3.23,
    width: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  favCircle: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontFamily: "serif",
    fontSize: 21,
    fontWeight: "700",
  },
  ratingRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  stars: {
    flexDirection: "row",
    marginRight: 6,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: "700",
  },
  reviewCount: {
    fontWeight: "400",
    color: "#7A9383",
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  variantsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  variantBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  variantWeight: {
    fontSize: 11,
    fontWeight: "500",
  },
  variantPrice: {
    flexShrink: 1,
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 12,
    shadowColor: "#0D5428",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  viewProductButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  viewProductText: {
    fontSize: 11.5,
    fontWeight: "600",
  },
  cartSquare: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
