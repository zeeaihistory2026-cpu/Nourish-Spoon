import { BadgeCheck, ThumbsUp } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '../ui/Avatar';
import { Stars } from '../ui/Stars';
import { AppText } from '../ui/AppText';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { colors, radius } from '../../theme';
import { timeAgo } from '../../utils/date';
import { openWhatsApp } from '../../utils/whatsapp';
import { BRAND } from '../../constants';
import type { Review } from '../../types/review';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.userName === 'Misbah' || review.userName === 'ShahJehan' ? (
          <Avatar name={review.userName} size="sm" color="#C9917E" />
        ) : (
          <Avatar name={review.userName} size="sm" />
        )}
        <View style={styles.who}>
          <View style={styles.nameRow}>
            <AppText variant="bodySemibold" color="greenDark">
              {review.userName}
            </AppText>
            {review.verifiedPurchase ? (
              <View style={styles.verified}>
                <BadgeCheck size={13} color={colors.greenMid} strokeWidth={2.2} />
                <AppText variant="micro" style={{ color: colors.greenMid }}>
                  Verified Purchase
                </AppText>
              </View>
            ) : null}
          </View>
          <View style={styles.locationRow}>
            <AppText variant="small" color="textMid">
              ðŸ“ {review.city ?? 'Pakistan'}
            </AppText>
          </View>
        </View>
        <AppText variant="small" color="textLight">
          {timeAgo(review.createdAt)}
        </AppText>
      </View>

      <View style={styles.starsRow}>
        <Stars rating={review.rating} size={17} />
      </View>

      <View style={styles.productRow}>
        {review.productImage ? (
          <Image
            source={review.productImage}
            style={styles.productThumb}
            contentFit="cover"
            transition={150}
          />
        ) : null}
        <View style={styles.productBody}>
          <AppText variant="cardTitle" color="greenDark">
            {review.productName}
          </AppText>
          <AppText variant="body" color="text" style={styles.comment}>
            {review.comment}
          </AppText>
        </View>
      </View>

      {review.screenshot ? (
        <View style={styles.screenshotRow}>
          <View style={styles.screenshotCard}>
            <View style={styles.screenshotIcon}>
              <WhatsAppIcon size={19} />
            </View>
            <View style={styles.screenshotBubble}>
              <AppText variant="small" color="text">
                {review.screenshot.text}
              </AppText>
              <AppText variant="microRegular" color="textLight" style={styles.screenshotTime}>
                {review.screenshot.time}
              </AppText>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.screenshotButton, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel="View screenshot"
          >
            <AppText variant="captionMedium" color="greenDark">
              ðŸ‘ View Screenshot
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Pressable
          onPress={() => setHelpful((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel="Mark review helpful"
          style={({ pressed }) => [styles.footerButton, pressed && { opacity: 0.7 }]}
        >
          <ThumbsUp size={17} color={helpful ? colors.greenMid : colors.textMid} strokeWidth={1.9} />
          <AppText variant="caption" color="textMid">
            Helpful ({(review.helpfulCount ?? 0) + (helpful ? 1 : 0)})
          </AppText>
        </Pressable>
        <Pressable
          onPress={() =>
            void openWhatsApp(
              `Loved this review of ${BRAND.name}! "${review.comment}" â€” ${review.productName}`
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Share review on WhatsApp"
          style={({ pressed }) => [styles.footerButton, pressed && { opacity: 0.7 }]}
        >
          <WhatsAppIcon size={17} color={colors.greenMid} />
          <AppText variant="caption" color="textMid">
            Share
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  who: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationRow: {
    marginTop: 2,
  },
  starsRow: {
    marginTop: 9,
  },
  productRow: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 9,
  },
  productThumb: {
    width: 92,
    height: 66,
    borderRadius: radius.sm,
    backgroundColor: colors.imageBg,
  },
  productBody: {
    flex: 1,
  },
  comment: {
    marginTop: 3,
    fontSize: 13.5,
    lineHeight: 20,
  },
  screenshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 10,
  },
  screenshotCard: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E9E4DA',
    borderRadius: radius.md,
    padding: 8,
  },
  screenshotIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenshotBubble: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: 7,
  },
  screenshotTime: {
    textAlign: 'right',
    marginTop: 2,
  },
  screenshotButton: {
    flex: 1,
    backgroundColor: colors.goldBg,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderRow,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
});
