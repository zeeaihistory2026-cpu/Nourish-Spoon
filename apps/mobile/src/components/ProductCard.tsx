import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Product, ProductVariant } from "@packages/types";
import { formatPKR } from "@packages/utils";
import { useMobileStore } from "../services/storeService";
import { TouchableOpacity } from "./AppTouchable";
import { Text, PriceText, Rating } from "./DesignPrimitives";
import { ProductArtwork } from "./ProductArtwork";
import {
  BUTTON_COLORS,
  BUTTON_OUTLINE,
  WHATSAPP_BUTTON_COLORS,
} from "../constants/theme";
import { remainingCartQuantity } from "../features/commerce/cart";

type Props = {
  product: Product;
  compact?: boolean;
  onSelect: (product: Product) => void;
  onAdd: (product: Product, variant: ProductVariant, quantity?: number) => void;
  onWhatsApp?: (product: Product, variant: ProductVariant) => void;
};

/** One catalogue card and one source of truth for size, price and availability. */
export function ProductCard({
  product,
  compact = false,
  onSelect,
  onAdd,
  onWhatsApp,
}: Props) {
  const theme = useMobileStore((state) => state.theme);
  const favorite = useMobileStore((state) =>
    state.favorites.includes(product.id),
  );
  const toggleFavorite = useMobileStore((state) => state.toggleFavorite);
  const cart = useMobileStore((state) => state.cart);
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const variants = product.variants.filter((variant) => variant.active);
  const variant =
    variants.find((variant) => variant.id === variantId) ||
    variants.find((variant) => variant.is_default) ||
    variants[0];
  if (!product.active || !variant) return null;
  const soldOut = variant.stock === 0 || product.legacy_stock === 0;
  const price = variant.sale_price ?? variant.regular_price;
  const limit = remainingCartQuantity(product, variant, cart);
  const selectedQuantity = compact ? 1 : Math.min(quantity, Math.max(1, limit));
  return (
    <View
      style={[
        s.card,
        compact && s.compact,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View>
        <TouchableOpacity
          accessibilityLabel={`View ${product.name}`}
          onPress={() => onSelect(product)}
          style={[s.artwork, { backgroundColor: theme.surfaceWarm }]}
        >
          <ProductArtwork product={product} photograph />
        </TouchableOpacity>
      </View>
      <View style={[s.body, compact && s.compactBody]}>
        <TouchableOpacity
          accessibilityLabel={`Details of ${product.name}`}
          onPress={() => onSelect(product)}
        >
          <Text
            numberOfLines={compact ? 3 : undefined}
            style={[s.title, compact && s.compactTitle]}
          >
            {product.name}
          </Text>
        </TouchableOpacity>
        {!compact && (
          <>
            <Text
              numberOfLines={2}
              style={[s.description, { color: theme.textSecondary }]}
            >
              {product.short_description}
            </Text>
            {product.review_count > 0 && <Rating product={product} compact />}
            {variants.length > 1 && (
              <View style={s.variants}>
                {variants.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    accessibilityLabel={`Choose ${size.weight} of ${product.name}`}
                    accessibilityState={{ selected: size.id === variant.id }}
                    onPress={() => setVariantId(size.id)}
                    style={[
                      s.variant,
                      {
                        borderColor:
                          size.id === variant.id ? theme.primary : theme.border,
                        backgroundColor:
                          size.id === variant.id
                            ? theme.surfaceWarm
                            : theme.surface,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: size.id === variant.id ? "700" : "400",
                      }}
                    >
                      {size.weight}
                    </Text>
                    {size.id === variant.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={17}
                        color={theme.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
        <View style={s.purchase}>
          <View style={s.purchaseHeader}>
            <View style={{ flex: 1 }}>
              <View style={s.priceRow}>
                <PriceText
                  numberOfLines={compact ? 1 : undefined}
                  adjustsFontSizeToFit={compact}
                  minimumFontScale={0.75}
                >
                  {formatPKR(price)}
                </PriceText>
                {!compact && price < variant.regular_price && (
                  <Text
                    style={[s.originalPrice, { color: theme.textSecondary }]}
                  >
                    {formatPKR(variant.regular_price)}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  s.size,
                  { color: soldOut ? theme.danger : theme.textSecondary },
                ]}
              >
                {variant.weight}
                {soldOut ? " · Sold out" : ""}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityLabel={`${favorite ? "Remove from" : "Save to"} favourites: ${product.name}`}
              accessibilityState={{ selected: favorite }}
              onPress={() => toggleFavorite(product.id)}
              style={[s.favorite, { backgroundColor: theme.surfaceWarm }]}
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={21}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={s.actions}>
            <View style={s.buyRow}>
              {!compact && (
                <View
                  style={[s.quantity, { backgroundColor: theme.surfaceWarm }]}
                >
                  <TouchableOpacity
                    accessibilityLabel={`Decrease quantity of ${product.name}`}
                    hitSlop={{ top: 5, bottom: 5 }}
                    disabled={selectedQuantity <= 1}
                    onPress={() => setQuantity(selectedQuantity - 1)}
                    style={[
                      s.quantityButton,
                      selectedQuantity <= 1 && s.disabled,
                    ]}
                  >
                    <Ionicons name="remove" size={19} color={theme.text} />
                  </TouchableOpacity>
                  <Text
                    accessibilityLabel={`Quantity ${selectedQuantity}`}
                    style={s.quantityLabel}
                  >
                    {selectedQuantity}
                  </Text>
                  <TouchableOpacity
                    accessibilityLabel={`Increase quantity of ${product.name}`}
                    hitSlop={{ top: 5, bottom: 5 }}
                    disabled={selectedQuantity >= limit}
                    onPress={() => setQuantity(selectedQuantity + 1)}
                    style={[
                      s.quantityButton,
                      selectedQuantity >= limit && s.disabled,
                    ]}
                  >
                    <Ionicons name="add" size={19} color={theme.text} />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                accessibilityLabel={`Add ${selectedQuantity} of ${product.name} to cart`}
                hitSlop={{ top: 5, bottom: 5 }}
                disabled={!limit}
                onPress={() => onAdd(product, variant, selectedQuantity)}
                style={[s.add, !limit && s.disabled]}
              >
                <Ionicons
                  name="cart-outline"
                  size={compact ? 14 : 20}
                  color={BUTTON_COLORS.text}
                />
                <Text style={[s.addLabel, compact && s.compactAddLabel]}>
                  {soldOut ? "Sold out" : !limit ? "In cart" : "Add to Cart"}
                </Text>
              </TouchableOpacity>
            </View>
            {!compact && onWhatsApp && (
              <TouchableOpacity
                accessibilityLabel={`Order ${product.name} on WhatsApp`}
                disabled={soldOut}
                onPress={() => onWhatsApp(product, variant)}
                style={[s.whatsapp, BUTTON_OUTLINE, soldOut && s.disabled]}
              >
                <FontAwesome
                  name="whatsapp"
                  size={20}
                  color={WHATSAPP_BUTTON_COLORS.text}
                />
                <Text
                  style={{ fontSize: 13, color: WHATSAPP_BUTTON_COLORS.text }}
                >
                  Order on WhatsApp
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderWidth: 0,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#7C5834",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 18,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  compact: { flex: 1, minWidth: 0 },
  artwork: { width: "100%", aspectRatio: 1.5, overflow: "hidden" },
  favorite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 18, gap: 10, flex: 1 },
  compactBody: { padding: 10, gap: 8 },
  title: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 29,
  },
  compactTitle: {
    fontSize: 20,
    lineHeight: 23,
    minHeight: 48,
    includeFontPadding: true,
  },
  description: { fontSize: 13, lineHeight: 20 },
  variants: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  variant: {
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  purchase: { marginTop: "auto", paddingTop: 2 },
  purchaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 8,
  },
  originalPrice: { fontSize: 13, textDecorationLine: "line-through" },
  size: { fontSize: 12, lineHeight: 18 },
  actions: { gap: 8 },
  buyRow: { flexDirection: "row", alignItems: "stretch", gap: 6 },
  quantity: {
    ...BUTTON_OUTLINE,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    minHeight: 34,
    width: 112,
  },
  quantityButton: {
    flex: 1,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityLabel: {
    minWidth: 14,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  add: {
    flex: 1,
    flexDirection: "row",
    minHeight: 34,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 12,
    ...BUTTON_OUTLINE,
    backgroundColor: BUTTON_COLORS.background,
    paddingHorizontal: 6,
  },
  addLabel: {
    color: BUTTON_COLORS.text,
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "center",
  },
  compactAddLabel: { fontSize: 11, lineHeight: 15 },
  whatsapp: {
    backgroundColor: WHATSAPP_BUTTON_COLORS.background,
    width: "100%",
    flexDirection: "row",
    gap: 8,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 11,
  },
  disabled: { opacity: 0.5 },
});
