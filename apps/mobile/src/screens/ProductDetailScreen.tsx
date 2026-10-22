import { BUTTON_OUTLINE, WHATSAPP_BUTTON_COLORS } from "../constants/theme";
import { Accordion } from "../components/Accordion";

import { Text, PriceText } from "../components/DesignPrimitives";

import React, { useState } from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
} from "react-native";

import { TouchableOpacity } from "../components/AppTouchable";

import Ionicons from "@expo/vector-icons/Ionicons";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { TrustBadges } from "../components/TrustBadges";

import { useMobileStore } from "../services/storeService";

import { ASSETS } from "../constants/assets";

import { formatPKR, formatPer100g } from "@packages/utils";

import { Product, ProductVariant } from "@packages/types";

import { Copy } from "../features/commerce/components";

import { ProductArtwork } from "../components/ProductArtwork";

interface ProductDetailScreenProps {
  product: Product;

  onBack: () => void;

  onOpenWhatsAppOrder: (prod: Product, variant?: ProductVariant) => void;

  onAddToCart: (prod: Product, variant?: ProductVariant) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,

  onBack,

  onOpenWhatsAppOrder,

  onAddToCart,
}) => {
  const { width } = useWindowDimensions();

  const { theme, products, favorites, toggleFavorite } = useMobileStore();

  const published = products.find((item) => item.id === product.id);

  const prod = published || product;

  const isFav = favorites.includes(prod.id);

  const [selectedWeight, setSelectedWeight] = useState<string>(
    prod.variants[0]?.weight || "250g",
  );

  const activeVariant =
    prod.variants.find((v) => v.active && v.weight === selectedWeight) ||
    prod.variants.find((v) => v.active);

  const unavailable =
    !published ||
    !prod.active ||
    !activeVariant ||
    activeVariant.stock === 0 ||
    prod.legacy_stock === 0;

  const isPanjeeri = prod.category === "panjeeri";

  const ingredientImages: Record<string, ImageSourcePropType> = {
    ...ASSETS.ingredients,

    ...(isPanjeeri ? ASSETS.panjeeriIngredients : {}),
  };

  const ingredientArtwork = (slug: string) =>
    ingredientImages[slug.replace(/-/g, "_")];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.topFloatBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          accessibilityRole="button"

          accessibilityLabel="Go back"

          onPress={onBack}

          style={[styles.floatingCircle, { backgroundColor: theme.surface }]}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,

            textAlign: "center",

            fontFamily: "serif",

            fontSize: 23,

            fontWeight: "700",

            color: theme.text,
          }}
        >
          Product Details
        </Text>

        <TouchableOpacity
          accessibilityRole="button"

          accessibilityLabel={`Favorite ${prod.name}`}

          accessibilityState={{ selected: isFav }}

          onPress={() => toggleFavorite(prod.id)}

          style={[styles.floatingCircle, { backgroundColor: theme.surface }]}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}

            size={20}

            color="#E11D48"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}

        contentContainerStyle={styles.scrollContent}
      >
        {/* Full Bleed Hero Header Image */}

        <View style={styles.heroContainer}>
          <ProductArtwork product={prod} />
        </View>

        {/* Content Body */}

        <View style={styles.contentBody}>
          {/* Title & Reviews */}

          <Text style={[styles.productTitle, { color: theme.text }]}>
            {prod.name}
          </Text>

          {prod.review_count > 0 && (
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={15} color="#C9A84C" />
                ))}
              </View>

              <Text style={styles.ratingScore}>
                {prod.rating}{" "}
                <Text style={styles.reviewVerified}>
                  ({prod.review_count} verified reviews)
                </Text>
              </Text>
            </View>
          )}

          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {prod.short_description}
          </Text>

          {/* Variants Selector */}

          <View style={styles.variantsRow}>
            {prod.variants

              .filter((variant) => variant.active)

              .map((v) => {
                const isSelected = activeVariant?.id === v.id;

                return (
                  <TouchableOpacity
                    accessibilityRole="button"

                    accessibilityLabel={`Choose ${v.weight}`}

                    accessibilityState={{ selected: isSelected }}

                    key={v.id}

                    onPress={() => setSelectedWeight(v.weight)}

                    style={[
                      styles.variantCard,

                      width < 360 && { paddingHorizontal: 9 },

                      isSelected
                        ? {
                            backgroundColor: isPanjeeri
                              ? theme.surfaceWarm
                              : theme.primaryDark,

                            borderColor: theme.primary,
                          }
                        : {
                            backgroundColor: theme.surface,

                            borderColor: theme.border,
                          },
                    ]}

                    activeOpacity={0.85}
                  >
                    <View>
                      <Text
                        style={[
                          styles.varWeight,

                          {
                            color:
                              isSelected && !isPanjeeri
                                ? "#FFFFFF"
                                : theme.textSecondary,
                          },
                        ]}
                      >
                        {v.weight}
                      </Text>

                      <PriceText
                        style={[
                          styles.varPrice,

                          {
                            color:
                              isSelected && !isPanjeeri
                                ? "#FFFFFF"
                                : theme.text,
                          },
                        ]}
                      >
                        {formatPKR(v.sale_price ?? v.regular_price)}
                      </PriceText>

                      {!isPanjeeri && v.price_per_100g && (
                        <Text
                          style={[
                            styles.varPer100g,

                            { color: isSelected ? "#A9C4B3" : theme.textMuted },
                          ]}
                        >
                          {formatPer100g(v.price_per_100g)}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.variantCheckCircle,

                        isSelected
                          ? { backgroundColor: "#FFFFFF" }
                          : { borderColor: theme.border, borderWidth: 1 },
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="#1B4332" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>

          {/* 4 Trust Badges */}

          {(prod.category === "energy_balls" || isPanjeeri) && (
            <TrustBadges variant="product" />
          )}

          <View style={{ marginTop: 18, gap: 12 }}>
            {prod.category !== "combos" && <Accordion
              key={`${prod.id}:ingredients`}
              title="Premium Ingredients"
            >
              <View style={styles.ingredientsGrid}>
                {prod.ingredients?.map((ing) => (
                  <View
                    key={ing.id}

                    style={[
                      styles.ingredientItem,

                      {
                        width: width < 380 ? "23%" : "17.8%",

                        borderWidth: 1,
                      },

                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    {ingredientArtwork(ing.slug) ? (
                      <Image
                        source={ingredientArtwork(ing.slug)}

                        accessibilityLabel={ing.name}

                        style={[
                          styles.ingredientImage,

                          {
                            width: 48,

                            height: 40,

                            borderRadius: 0,
                          },
                        ]}

                        resizeMode="contain"
                      />
                    ) : (
                      <View
                        style={{
                          height: 44,

                          justifyContent: "center",

                          marginBottom: 4,
                        }}
                      >
                        <Ionicons
                          name={
                            ing.slug === "sugar"
                              ? "cube-outline"
                              : "leaf-outline"
                          }

                          size={28}

                          color={theme.primary}
                        />
                      </View>
                    )}

                    <Text
                      style={[styles.ingredientName, { color: theme.text }]}
                    >
                      {ing.name}
                    </Text>
                  </View>
                ))}
              </View>

              {!!prod.ingredient_notes && <Copy>{prod.ingredient_notes}</Copy>}

              {isPanjeeri && <Copy>{prod.description}</Copy>}
            </Accordion>}

            <Accordion key={`${prod.id}:nutrition`} title="Nutrition per 100g">
              {prod.nutrition_facts?.map((fact) => (
                <View
                  key={fact.id}

                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",

                    gap: 12,
                  }}
                >
                  <Text>{fact.label}</Text>

                  <Text>
                    {fact.value} {fact.unit}
                  </Text>
                </View>
              ))}

              <Copy>
                {prod.nutrition_facts?.length
                  ? "Values published by nourishspoon.com. Independent laboratory verification is unavailable."
                  : "Confirmed nutrition for this recipe or combo is not yet available. Please contact our team."}
              </Copy>
            </Accordion>

            <Accordion key={`${prod.id}:allergens`} title="Allergens">
              <Copy>
                {prod.category === "energy_balls"
                  ? "Contains tree nuts, milk (ghee), and sesame."
                  : "Contains tree nuts, wheat (semolina), and milk (ghee). Confirm the complete ingredient list for your selected recipe with our team."}{" "}
                Cross-contact information is not confirmed; contact us if you
                have an allergy.
              </Copy>
            </Accordion>

            <Accordion key={`${prod.id}:storage`} title="Storage & shelf life">
              <Copy>
                {prod.storage_instructions ||
                  "Follow each jar’s storage instructions and date. Confirm the pack contents and shelf life with our team."}
              </Copy>
            </Accordion>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom WhatsApp CTA Bar */}

      <View
        style={[
          styles.bottomBar,

          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          accessibilityRole="button"

          accessibilityLabel="Order on WhatsApp"

          disabled={unavailable}

          onPress={() => onOpenWhatsAppOrder(prod, activeVariant)}

          style={[
            styles.orderButton,
            {
              ...BUTTON_OUTLINE,
              backgroundColor: WHATSAPP_BUTTON_COLORS.background,
            },
          ]}

          activeOpacity={0.85}
        >
          <FontAwesome
            name="whatsapp"

            size={20}

            color={WHATSAPP_BUTTON_COLORS.text}

            style={{ marginRight: 8 }}
          />

          <Text style={styles.orderButtonText}>
            {unavailable ? "Currently unavailable" : "Order on WhatsApp →"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"

          accessibilityLabel={`Add ${prod.name} to cart`}

          disabled={unavailable}

          onPress={() => onAddToCart(prod, activeVariant)}

          style={{
            width: 48,

            height: 48,

            alignItems: "center",

            justifyContent: "center",

            borderRadius: 12,

            backgroundColor: theme.surfaceWarm,

            borderWidth: 1,

            borderColor: theme.border,
          }}
        >
          <Ionicons name="cart-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  heroContainer: {
    aspectRatio: 1.5,

    width: "100%",

    position: "relative",
  },

  heroImage: {
    width: "100%",

    height: "100%",
  },

  topFloatBar: {
    paddingHorizontal: 16,

    paddingVertical: 8,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  floatingCircle: {
    width: 44,

    height: 44,

    borderRadius: 20,

    alignItems: "center",

    justifyContent: "center",

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 5,

    elevation: 4,
  },

  contentBody: {
    paddingHorizontal: 14,

    paddingTop: 12,
  },

  productTitle: {
    fontFamily: "serif",

    fontSize: 26,

    fontWeight: "700",
  },

  ratingRow: {
    flexWrap: "wrap",

    flexDirection: "row",

    alignItems: "center",

    marginTop: 6,

    marginBottom: 8,
  },

  stars: {
    flexDirection: "row",

    marginRight: 6,
  },

  ratingScore: {
    fontSize: 13,

    fontWeight: "700",
  },

  reviewVerified: {
    fontSize: 11,

    fontWeight: "400",

    color: "#7A9383",
  },

  description: {
    fontSize: 12.5,

    lineHeight: 18,

    marginBottom: 16,
  },

  variantsRow: {
    flexDirection: "row",

    gap: 12,

    marginBottom: 10,
  },

  variantCard: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingVertical: 12,

    paddingHorizontal: 14,

    borderRadius: 16,

    borderWidth: 1.5,
  },

  varWeight: {
    fontSize: 12,

    fontWeight: "600",
  },

  varPrice: {
    fontSize: 16,

    fontWeight: "800",

    marginTop: 2,
  },

  varPer100g: {
    fontSize: 9.5,

    marginTop: 1,
  },

  variantCheckCircle: {
    width: 22,

    height: 22,

    borderRadius: 11,

    alignItems: "center",

    justifyContent: "center",
  },

  ingredientsGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 6,

    marginBottom: 18,
  },

  ingredientItem: {
    width: "18.2%",

    borderRadius: 14,

    borderWidth: 1,

    alignItems: "center",

    paddingVertical: 8,

    paddingHorizontal: 2,
  },

  ingredientImage: {
    width: 32,

    height: 32,

    marginBottom: 4,
  },

  ingredientName: {
    fontSize: 9,

    fontWeight: "600",

    textAlign: "center",

    lineHeight: 11,
  },

  nutritionBox: {
    borderRadius: 18,

    borderWidth: 1,

    padding: 14,

    marginBottom: 14,
  },

  nutritionTitle: {
    fontFamily: "serif",

    fontSize: 15,

    fontWeight: "700",

    marginBottom: 10,
  },

  nutritionGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    rowGap: 10,
  },

  nutritionItem: {
    width: "33.3%",
  },

  nutritionLabel: {
    fontSize: 10.5,
  },

  nutritionVal: {
    fontSize: 12,

    fontWeight: "700",

    marginTop: 1,
  },

  infoCard: {
    borderRadius: 16,

    borderWidth: 1,

    padding: 12,

    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  infoHead: {
    fontSize: 12,

    fontWeight: "700",
  },

  infoBody: {
    fontSize: 11,

    lineHeight: 15,

    marginTop: 2,
  },

  bottomBar: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    paddingHorizontal: 20,

    paddingTop: 12,

    paddingBottom: 20,

    borderTopWidth: 1,
  },

  orderButton: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    height: 50,

    borderRadius: 25,

    shadowColor: "#1B4332",

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.25,

    shadowRadius: 6,

    elevation: 4,
  },

  orderButtonText: {
    color: WHATSAPP_BUTTON_COLORS.text,

    fontSize: 14,

    fontWeight: "700",
  },
});
