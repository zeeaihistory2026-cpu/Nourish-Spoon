import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "./AppTouchable";
import { useRemotePhoto } from "../services/photos";
import { ThemeType, BUTTON_OUTLINE } from "../constants/theme";

/** Both published testimonials and approved purchases use this presentation. */
export type CustomerReview = {
  id: string;
  name: string;
  location: string;
  rating: number;
  productName: string;
  headline?: string;
  comment: string;
  verified: boolean;
  helpful: number;
  category: string;
  screenshotSource?: ImageSourcePropType;
  photoId?: string;
};
export type ReviewMedia = { source: ImageSourcePropType; name: string };
export const REVIEW_FONTS = {
  regular: "Inter_400Regular",
  bold: "Inter_700Bold",
  italic: "Inter_400Regular_Italic",
  display: "PlayfairDisplay_700Bold",
} as const;

export function CustomerReviewCard({
  review,
  theme,
  voted,
  onVote,
  onShare,
  onOpenMedia,
}: {
  review: CustomerReview;
  theme: ThemeType;
  voted: boolean;
  onVote: () => void;
  onShare: () => void;
  onOpenMedia: (media: ReviewMedia) => void;
}) {
  const photo = useRemotePhoto(
    review.photoId ? `reviews/${review.photoId}/media/photo` : undefined,
  );
  const source =
    review.screenshotSource || (photo ? { uri: photo } : undefined);
  const green = theme.isDark ? theme.goldLight : "#1B4332";
  const ink = theme.isDark ? theme.text : "#1a1a1a";
  const count = review.helpful + (voted ? 1 : 0);
  return (
    <View
      testID="customer-review-card"
      style={[
        s.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.isDark ? theme.border : "#1B433214",
        },
      ]}
    >
      <View style={s.body}>
        <View style={s.author}>
          <View style={s.avatar}>
            <Text style={s.initial}>
              {Array.from(review.name.trim())[0]?.toUpperCase() || "N"}
            </Text>
          </View>
          <View style={s.identity}>
            <View style={s.nameRow}>
              <Text style={[s.name, { color: ink }]}>{review.name}</Text>
              {review.verified && (
                <View
                  style={[
                    s.verified,
                    {
                      backgroundColor: theme.isDark
                        ? theme.goldWarm
                        : "#1B433212",
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons name="checkmark" size={11} color={green} />
                  <Text style={[s.badgeText, { color: green }]}>Verified</Text>
                </View>
              )}
            </View>
            {!!review.location && (
              <Text style={[s.location, { color: theme.textMuted }]}>
                {review.location}
              </Text>
            )}
          </View>
        </View>
        <View
          style={s.stars}
          accessible
          accessibilityLabel={`${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <Ionicons
              key={value}
              name={value <= review.rating ? "star" : "star-outline"}
              size={16}
              color="#C9A84C"
            />
          ))}
        </View>
        <View
          style={[
            s.tag,
            {
              backgroundColor: theme.isDark ? theme.surfaceWarm : "#f3f8f5",
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[s.product, { color: green }]}>
            {review.productName}
          </Text>
        </View>
        {!!review.headline && (
          <Text style={[s.headline, { color: ink }]}>{review.headline}</Text>
        )}
        <Text style={[s.comment, { color: theme.textSecondary }]}>
          {review.comment}
        </Text>
      </View>
      {!!source && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`View ${review.screenshotSource ? "screenshot" : "photo"} from ${review.name}`}
          onPress={() => onOpenMedia({ source, name: review.name })}
          style={[
            s.media,
            {
              backgroundColor: theme.isDark ? theme.surfaceWarm : "#fafafa",
              borderColor: theme.border,
            },
          ]}
        >
          <Image
            source={source}
            accessibilityLabel={
              review.screenshotSource
                ? "Published WhatsApp feedback"
                : "Customer review photo"
            }
            resizeMode="cover"
            style={s.thumbnail}
          />
          <View style={s.mediaInfo}>
            <Text style={[s.mediaLabel, { color: theme.textMuted }]}>
              {review.screenshotSource
                ? "WHATSAPP SCREENSHOT"
                : "CUSTOMER PHOTO"}
            </Text>
            <View style={s.mediaButton}>
              <Ionicons name="expand-outline" size={13} color="#fff" />
              <Text style={s.mediaButtonText}>
                {review.screenshotSource ? "View Screenshot" : "View Photo"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      <View style={[s.footer, { borderColor: theme.border }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Helpful review by ${review.name}: ${count}`}
          accessibilityState={{ selected: voted }}
          onPress={onVote}
          style={[
            s.action,
            {
              borderColor: theme.border,
              backgroundColor: voted ? theme.goldWarm : "transparent",
            },
          ]}
        >
          <Ionicons
            name={voted ? "thumbs-up" : "thumbs-up-outline"}
            size={14}
            color={green}
          />
          <Text style={[s.actionText, { color: green }]}>
            Helpful ({count})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Share review by ${review.name}`}
          onPress={onShare}
          style={[s.action, { borderColor: theme.border }]}
        >
          <Ionicons name="share-outline" size={15} color={green} />
          <Text style={[s.actionText, { color: green }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Matches nourishspoon.com/testimonials.html at its phone breakpoint.
const s = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
  },
  body: { padding: 16, paddingBottom: 0 },
  author: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#40916C",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: { fontFamily: REVIEW_FONTS.display, fontSize: 16, color: "#fff" },
  identity: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontFamily: REVIEW_FONTS.bold,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontFamily: REVIEW_FONTS.bold, fontSize: 10, lineHeight: 14 },
  location: {
    fontFamily: REVIEW_FONTS.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  stars: { flexDirection: "row", gap: 2, marginBottom: 10 },
  tag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  product: { fontFamily: REVIEW_FONTS.regular, fontSize: 11, lineHeight: 16 },
  headline: {
    fontFamily: REVIEW_FONTS.bold,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  comment: {
    fontFamily: REVIEW_FONTS.italic,
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 14,
  },
  media: {
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  thumbnail: { width: 54, height: 68, borderRadius: 8 },
  mediaInfo: { flex: 1, minWidth: 0, gap: 6 },
  mediaLabel: {
    fontFamily: REVIEW_FONTS.bold,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  mediaButton: {
    ...BUTTON_OUTLINE,
    backgroundColor: "#1B4332",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
  },
  mediaButtonText: {
    fontFamily: REVIEW_FONTS.bold,
    fontSize: 11,
    color: "#fff",
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  action: {
    minHeight: 40,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  actionText: { fontFamily: REVIEW_FONTS.regular, fontSize: 12 },
});
