import { Text } from '../components/DesignPrimitives';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { TrustBadges } from '../components/TrustBadges';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';
import { formatPKR, formatPer100g } from '@packages/utils';
import { Product, ProductVariant } from '@packages/types';

interface ProductDetailScreenProps {
  product?: Product;
  onBack: () => void;
  onOpenWhatsAppOrder: (prod: Product, variant?: ProductVariant) => void;
}

const { width } = Dimensions.get('window');

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onBack,
  onOpenWhatsAppOrder
}) => {
  const { theme, selectedProduct, favorites, toggleFavorite } = useMobileStore();
  const prod = product || selectedProduct;
  const isFav = favorites.includes(prod.id);

  const [selectedWeight, setSelectedWeight] = useState<string>(prod.variants[0]?.weight || '250g');
  const activeVariant = prod.variants.find(v => v.weight === selectedWeight) || prod.variants[0];

  const isPanjeeri = prod.category === 'panjeeri';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Full Bleed Hero Header Image */}
        <View style={styles.heroContainer}>
          <Image
            source={isPanjeeri ? ASSETS.panjeeriDetailHero : ASSETS.energyBallsDetailHero}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Top floating circle buttons */}
          <View style={styles.topFloatBar}>
            <TouchableOpacity
              accessibilityLabel="Go back"
              onPress={onBack}
              style={[styles.floatingCircle, { backgroundColor: theme.surface }]}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={20} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFavorite(prod.id)}
              style={[styles.floatingCircle, { backgroundColor: theme.surface }]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color="#E11D48"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          {/* Title & Reviews */}
          <Text style={[styles.productTitle, { color: theme.text }]}>
            {prod.name}
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={15} color="#C99B36" />
              ))}
            </View>
            <Text style={styles.ratingScore}>
              {prod.rating}{' '}
              <Text style={styles.reviewVerified}>({prod.review_count} verified reviews)</Text>
            </Text>
          </View>

          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {prod.short_description}
          </Text>

          {/* Variants Selector */}
          <View style={styles.variantsRow}>
            {prod.variants.map((v) => {
              const isSelected = selectedWeight === v.weight;
              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedWeight(v.weight)}
                  style={[
                    styles.variantCard,
                    isSelected
                      ? { backgroundColor: isPanjeeri ? theme.surfaceWarm : theme.primaryDark, borderColor: theme.primary }
                      : { backgroundColor: theme.surface, borderColor: theme.border }
                  ]}
                  activeOpacity={0.85}
                >
                  <View>
                    <Text
                      style={[
                        styles.varWeight,
                        { color: isSelected && !isPanjeeri ? '#FFFFFF' : theme.textSecondary }
                      ]}
                    >
                      {v.weight}
                    </Text>
                    <Text
                      style={[
                        styles.varPrice,
                        { color: isSelected && !isPanjeeri ? '#FFFFFF' : theme.text }
                      ]}
                    >
                      {formatPKR(v.sale_price || v.regular_price)}
                    </Text>
                    {!isPanjeeri && v.price_per_100g && (
                      <Text
                        style={[
                          styles.varPer100g,
                          { color: isSelected ? '#A9C4B3' : theme.textMuted }
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
                        ? { backgroundColor: '#FFFFFF' }
                        : { borderColor: theme.border, borderWidth: 1 }
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#0D5428" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 4 Trust Badges */}
          <TrustBadges variant="product" />

          {/* Key Ingredients Header */}
          <View style={styles.ingredientsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isPanjeeri ? 'Key Ingredients' : 'Premium Ingredients'}
            </Text>
            <TouchableOpacity onPress={() => Alert.alert('Ingredients & Storage', (prod.description || '') + '\n\n' + prod.storage_instructions)} activeOpacity={0.7} style={styles.knowMoreRow}>
              <Text style={[styles.knowMoreText, { color: theme.primary }]}>
                {isPanjeeri ? '12 Natural Ingredients' : 'Know More'}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Ingredients Grid */}
          <View style={styles.ingredientsGrid}>
            {prod.ingredients?.map((ing) => (
              <View
                key={ing.id}
                style={[styles.ingredientItem, { width: isPanjeeri ? '15.3%' : '18.2%', borderWidth: isPanjeeri ? 0 : 1 }, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Image
                  source={(ASSETS.ingredients as any)[ing.slug.replace(/-/g, '_')] || ASSETS.ingredients.dates}
                  style={[styles.ingredientImage, { width: isPanjeeri ? 42 : 48, height: isPanjeeri ? 42 : 40, borderRadius: isPanjeeri ? 25 : 0 }]}
                  resizeMode="contain"
                />
                <Text
                  style={[styles.ingredientName, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {ing.name}
                </Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom WhatsApp CTA Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => onOpenWhatsAppOrder(prod, activeVariant)}
          style={[styles.orderButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
        >
          <FontAwesome name="whatsapp" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.orderButtonText}>Order on WhatsApp →</Text>
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
    paddingBottom: 8,
  },
  heroContainer: {
    aspectRatio: 1.37,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topFloatBar: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  contentBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  productTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
  },
  reviewVerified: {
    fontSize: 11,
    fontWeight: '400',
    color: '#7A9383',
  },
  description: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 16,
  },
  variantsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  variantCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  varWeight: {
    fontSize: 12,
    fontWeight: '600',
  },
  varPrice: {
    fontSize: 16,
    fontWeight: '800',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
  },
  knowMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  knowMoreText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 2,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  ingredientItem: {
    width: '18.2%',
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
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
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 11,
  },
  nutritionBox: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  nutritionTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  nutritionItem: {
    width: '33.3%',
  },
  nutritionLabel: {
    fontSize: 10.5,
  },
  nutritionVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoHead: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoBody: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  bottomBar: {

    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    shadowColor: '#0D5428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
