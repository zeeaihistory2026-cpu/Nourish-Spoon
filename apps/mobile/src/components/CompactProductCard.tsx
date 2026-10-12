import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product, ProductVariant } from "@packages/types";
import { formatPKR } from "@packages/utils";
import { Text } from "./DesignPrimitives";
import { ProductArtwork } from "./ProductArtwork";
import { useMobileStore } from "../services/storeService";

export function CompactProductCard({
  product,
  onSelect,
  onAdd,
}: {
  product: Product;
  onSelect: (product: Product) => void;
  onAdd: (product: Product, variant: ProductVariant) => void;
}) {
  const { theme, favorites, toggleFavorite } = useMobileStore();
  const variant = product.variants.find((size) => size.active)!;
  return (
    <View
      style={[
        s.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View ${product.name}`}
        onPress={() => onSelect(product)}
        style={s.image}
      >
        <ProductArtwork product={product} />
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Favorite ${product.name}`}
        hitSlop={6}
        accessibilityState={{ selected: favorites.includes(product.id) }}
        onPress={() => toggleFavorite(product.id)}
        style={s.favorite}
      >
        <Ionicons
          name={favorites.includes(product.id) ? "heart" : "heart-outline"}
          size={18}
          color="#E11D48"
        />
      </TouchableOpacity>
      <View style={s.body}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Details of ${product.name}`}
          onPress={() => onSelect(product)}
        >
          <Text numberOfLines={2} style={s.name}>
            {product.name}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 11, color: theme.textSecondary }}>
          {variant.weight}
        </Text>
        <View style={{ marginTop: "auto" }}>
          <Text style={[s.price, { color: theme.primary }]}>
            {formatPKR(variant.sale_price ?? variant.regular_price)}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart`}
            onPress={() => onAdd(product, variant)}
            style={s.add}
          >
            <Ionicons name="cart-outline" size={16} color="#fff" />
            <Text
              numberOfLines={1}
              style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: { width: "100%", aspectRatio: 1.5 },
  favorite: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, padding: 10, gap: 5 },
  name: {
    fontFamily: "serif",
    fontSize: 18,
    lineHeight: 20,
    minHeight: 40,
    fontWeight: "700",
  },
  price: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 3,
  },
  add: {
    minHeight: 44,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#1B4332",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
