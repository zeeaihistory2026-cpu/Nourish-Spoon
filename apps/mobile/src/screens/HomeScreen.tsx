import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { TrustBadges } from '../components/TrustBadges';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';
import { formatPKR, DEFAULT_WHATSAPP_PHONE, createWhatsAppUrl } from '@packages/utils';
import { Product } from '@packages/types';

interface HomeScreenProps {
  onNavigateTab: (tab: any) => void;
  onSelectProduct: (prod: Product) => void;
  onOpenWhatsAppOrder: (prod?: Product) => void;
  onOpenDeliveryInfo: () => void;
}

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onSelectProduct,
  onOpenWhatsAppOrder,
  onOpenDeliveryInfo
}) => {
  const { theme, products, favorites, toggleFavorite, addToCart } = useMobileStore();

  const handleGeneralWhatsApp = () => {
    const text = 'Hello Nourish Spoon, I would like to inquire about your handcrafted products.';
    const url = createWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, text);
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        onMenu={() => onNavigateTab('More')}
        onNotification={() => onNavigateTab('Reviews')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Same-Day Delivery Pill Banner */}
        <TouchableOpacity
          onPress={onOpenDeliveryInfo}
          style={[styles.deliveryBanner, { backgroundColor: theme.primaryDark }]}
          activeOpacity={0.85}
        >
          <View style={styles.deliveryLeft}>
            <View style={styles.truckIconWrapper}>
              <Ionicons name="bus" size={20} color={theme.gold} />
            </View>
            <View style={styles.deliveryTextWrapper}>
              <Text style={styles.deliveryTitle}>
                Same-day delivery in Sargodha
              </Text>
              <Text style={styles.deliverySubtitle}>
                Freshly made • Direct to your doorstep
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7DACF" />
        </TouchableOpacity>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroHeading, { color: theme.text }]}>
              Handcrafted{'\n'}
              Nutrition.{'\n'}
              Real Ingredients.{'\n'}
              <Text style={{ color: theme.gold, fontStyle: 'italic' }}>Pure Love.</Text>
            </Text>

            <Text style={[styles.heroSubtext, { color: theme.textSecondary }]}>
              Premium Panjeeri & Date-Nut Energy Balls made with pure, natural ingredients for your family’s well-being.
            </Text>

            {/* CTAs */}
            <View style={styles.heroButtons}>
              <TouchableOpacity
                onPress={() => onOpenWhatsAppOrder(products[0])}
                style={[styles.primaryCTA, { backgroundColor: theme.primary }]}
                activeOpacity={0.8}
              >
                <FontAwesome name="whatsapp" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryCTAText}>Order on WhatsApp →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onNavigateTab('Products')}
                style={[styles.secondaryCTA, { backgroundColor: theme.surfaceWarm, borderColor: theme.border }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.secondaryCTAText, { color: theme.text }]}>
                  Explore Products →
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Food Image */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={ASSETS.homeHeroFood}
              style={styles.heroFoodImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 4 Trust Badges */}
        <TrustBadges variant="home" />

        {/* Our Signature Products Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Our Signature Products
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab('Products')} activeOpacity={0.7}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              View All →
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2 Signature Products Grid */}
        <View style={styles.productsGrid}>
          {products.slice(0, 2).map((prod) => {
            const isFav = favorites.includes(prod.id);
            const defaultVar = prod.variants[0];
            return (
              <TouchableOpacity
                key={prod.id}
                onPress={() => onSelectProduct(prod)}
                style={[styles.productCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.9}
              >
                {/* Image */}
                <View style={styles.productImageContainer}>
                  <Image
                    source={prod.name.includes('Energy') ? ASSETS.energyBallsCard : ASSETS.panjeeriCard}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => toggleFavorite(prod.id)}
                    style={styles.favButton}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isFav ? 'heart' : 'heart-outline'}
                      size={16}
                      color={isFav ? '#E11D48' : '#E11D48'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
                    {prod.name}
                  </Text>

                  {/* Rating */}
                  <View style={styles.ratingRow}>
                    <View style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons key={i} name="star" size={11} color="#C99B36" />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>
                      {prod.rating} <Text style={styles.reviewsCount}>({prod.review_count} reviews)</Text>
                    </Text>
                  </View>

                  <Text style={[styles.productDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                    {prod.short_description}
                  </Text>

                  {/* Price & Action */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.fromLabel}>From</Text>
                      <Text style={[styles.priceValue, { color: theme.primaryDark }]}>
                        {formatPKR(defaultVar.sale_price || defaultVar.regular_price)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => addToCart(prod, defaultVar)}
                      style={[styles.cartCircle, { backgroundColor: theme.primary }]}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Customer Review Snapshot Banner */}
        <TouchableOpacity
          onPress={() => onNavigateTab('Reviews')}
          style={[styles.reviewPreviewCard, { backgroundColor: theme.surfaceWarm, borderColor: theme.border }]}
          activeOpacity={0.85}
        >
          <View style={styles.reviewHeader}>
            <View style={styles.reviewUser}>
              <Image source={ASSETS.avatarMisbah} style={styles.reviewAvatar} />
              <View>
                <Text style={[styles.reviewName, { color: theme.text }]}>Misbah • Verified Buyer</Text>
                <View style={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons key={i} name="star" size={10} color="#C99B36" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={[styles.reviewTime, { color: theme.textMuted }]}>2 weeks ago</Text>
          </View>
          <Text style={[styles.reviewComment, { color: theme.textSecondary }]}>
            "Bht acha ha! JazakAllah mam ❤️ The authentic homemade panjeeri is rich and crunchy."
          </Text>
        </TouchableOpacity>

        {/* Floating WhatsApp CTA */}
        <TouchableOpacity
          onPress={handleGeneralWhatsApp}
          style={[styles.whatsappBannerCTA, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
        >
          <FontAwesome name="whatsapp" size={22} color="#FFFFFF" />
          <Text style={styles.whatsappBannerText}>
            Direct WhatsApp Customer Care • +92 304 6721962
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 24,
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckIconWrapper: {
    marginRight: 12,
  },
  deliveryTextWrapper: {},
  deliveryTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  deliverySubtitle: {
    color: '#A9C4B3',
    fontSize: 11,
    marginTop: 1,
  },
  heroSection: {
    marginBottom: 8,
  },
  heroContent: {
    marginBottom: 12,
  },
  heroHeading: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  heroSubtext: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 8,
    maxWidth: '95%',
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  primaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    shadowColor: '#0D5428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCTAText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryCTA: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
  },
  secondaryCTAText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroImageWrapper: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 14,
  },
  heroFoodImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  productsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  productCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  productImageContainer: {
    height: 140,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reviewsCount: {
    fontWeight: '400',
    color: '#7A9383',
  },
  productDesc: {
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 4,
    minHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#EFE7D5',
  },
  fromLabel: {
    fontSize: 9,
    color: '#7A9383',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  cartCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPreviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginTop: 18,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewName: {
    fontSize: 11,
    fontWeight: '700',
  },
  reviewStars: {
    flexDirection: 'row',
    marginTop: 1,
  },
  reviewTime: {
    fontSize: 9.5,
  },
  reviewComment: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  whatsappBannerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  whatsappBannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
