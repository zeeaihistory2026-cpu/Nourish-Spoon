import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';
import { Review } from '@packages/types';

interface CustomerReviewsScreenProps {
  onBack: () => void;
}

export const CustomerReviewsScreen: React.FC<CustomerReviewsScreenProps> = ({ onBack }) => {
  const { theme, reviews } = useMobileStore();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Energy Balls' | 'Panjeeri'>('All');
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  const categories: Array<'All' | 'Energy Balls' | 'Panjeeri'> = ['All', 'Energy Balls', 'Panjeeri'];

  const filtered = reviews.filter(r => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Energy Balls') return r.product_name.includes('Energy');
    if (selectedCategory === 'Panjeeri') return r.product_name.includes('Panjeeri');
    return true;
  });

  const handleHelpful = (id: string, initial: number) => {
    const current = helpfulCounts[id] ?? initial;
    setHelpfulCounts({ ...helpfulCounts, [id]: current + 1 });
  };

  const handleShare = async (review: Review) => {
    try {
      await Share.share({
        message: `"${review.comment}" - ${review.customer_name} review for ${review.product_name} at Nourish Spoon.`
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        showBack
        onBack={onBack}
        rightAction="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: theme.primaryDark }]}>
            Customer Reviews
          </Text>
          <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
            Real stories. Real nutrition. Real love.
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterPill,
                  isActive
                    ? { backgroundColor: theme.primary }
                    : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: isActive ? '#FFFFFF' : theme.text }
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {filtered.map(r => {
            const helpful = helpfulCounts[r.id] ?? r.helpful_count;
            const isPanjeeri = r.product_name.includes('Panjeeri');

            return (
              <View
                key={r.id}
                style={[styles.reviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                {/* User Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.userLeft}>
                    {r.customer_avatar ? (
                      <Image source={{ uri: r.customer_avatar }} style={styles.avatarImg} />
                    ) : (
                      <View style={[styles.avatarFallback, { backgroundColor: theme.primaryDark }]}>
                        <Text style={styles.avatarLetter}>{r.customer_name.charAt(0)}</Text>
                      </View>
                    )}

                    <View>
                      <View style={styles.nameRow}>
                        <Text style={[styles.userName, { color: theme.text }]}>
                          {r.customer_name}
                        </Text>
                        {r.verified && (
                          <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={13} color="#0D5428" />
                            <Text style={styles.verifiedText}>Verified Purchase</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={11} color={theme.textMuted} />
                        <Text style={[styles.locationText, { color: theme.textMuted }]}>
                          {r.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.reviewTime, { color: theme.textMuted }]}>
                    {r.review_date}
                  </Text>
                </View>

                {/* Stars */}
                <View style={styles.starsRow}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color="#C99B36" />
                  ))}
                </View>

                {/* Product Reference Card */}
                <View style={[styles.productRefBox, { backgroundColor: theme.surfaceWarm, borderColor: theme.border }]}>
                  <Image
                    source={isPanjeeri ? ASSETS.panjeeriCard : ASSETS.energyBallsCard}
                    style={styles.productRefImg}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.productRefName, { color: theme.text }]}>
                      {r.product_name}
                    </Text>
                    <Text style={[styles.reviewComment, { color: theme.textSecondary }]} numberOfLines={3}>
                      {r.comment}
                    </Text>
                  </View>
                </View>

                {/* WhatsApp Chat Snippet Bubble if available */}
                {r.whatsapp_quote && (
                  <View style={styles.whatsappQuoteRow}>
                    <View style={styles.whatsappBubble}>
                      <FontAwesome name="whatsapp" size={18} color="#25D366" style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={styles.whatsappBubbleText}>
                        {r.whatsapp_quote}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => Alert.alert('Verified WhatsApp Feedback', `Verified chat transcript from customer: ${r.customer_name}`)}
                      style={[styles.viewScreenshotBtn, { backgroundColor: theme.goldWarm, borderColor: theme.goldLight }]}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="eye-outline" size={13} color={theme.gold} style={{ marginRight: 4 }} />
                      <Text style={[styles.viewScreenshotText, { color: theme.mode === 'light' ? '#7A5B0B' : '#F1D79E' }]}>
                        View Screenshot
                      </Text>
                      <Ionicons name="chevron-forward" size={11} color={theme.gold} />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Footer: Helpful & Share */}
                <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                  <TouchableOpacity
                    onPress={() => handleHelpful(r.id, r.helpful_count)}
                    style={styles.footerAction}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="thumbs-up-outline" size={14} color={theme.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.footerActionText, { color: theme.textSecondary }]}>
                      Helpful ({helpful})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleShare(r)}
                    style={styles.footerAction}
                    activeOpacity={0.7}
                  >
                    <FontAwesome name="whatsapp" size={14} color="#25D366" style={{ marginRight: 4 }} />
                    <Text style={[styles.footerActionText, { color: theme.textSecondary }]}>
                      Share
                    </Text>
                  </TouchableOpacity>
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
    paddingBottom: 30,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 12.5,
    marginTop: 3,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarLetter: {
    color: '#FFF9EC',
    fontSize: 18,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontSize: 10.5,
    color: '#0D5428',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
  },
  reviewTime: {
    fontSize: 10.5,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 2,
  },
  productRefBox: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  productRefImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  productRefName: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  reviewComment: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  whatsappQuoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  whatsappBubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E7F8EE',
    padding: 8,
    borderRadius: 12,
  },
  whatsappBubbleText: {
    fontSize: 11,
    color: '#064E24',
    lineHeight: 14,
  },
  viewScreenshotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  viewScreenshotText: {
    fontSize: 10.5,
    fontWeight: '700',
    marginRight: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerActionText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
