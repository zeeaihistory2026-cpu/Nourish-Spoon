import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "../components/AppTouchable";
import { Header } from "../components/Header";
import { GreenButton } from "../components/DesignPrimitives";
import {
  CustomerReview,
  CustomerReviewCard,
  ReviewMedia,
  REVIEW_FONTS,
} from "../components/CustomerReviewCard";
import { AppNavigation } from "../navigation/types";
import { useMobileStore } from "../services/storeService";
import { WEBSITE_REVIEWS } from "../data/websiteReviews";

export function CustomerReviewsScreen({
  onBack,
  navigation,
}: {
  onBack?: () => void;
  navigation?: AppNavigation;
}) {
  const { theme, reviews, products } = useMobileStore();
  const { height } = useWindowDimensions();
  const [category, setCategory] = useState("all");
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [media, setMedia] = useState<ReviewMedia | null>(null);
  const published: CustomerReview[] = reviews
    .filter(
      (review) =>
        review.status === "approved" &&
        !WEBSITE_REVIEWS.some((website) => website.id === review.id),
    )
    .map((review) => {
      const productCategory = products.find(
        (product) => product.id === review.product_id,
      )?.category;
      return {
        id: review.id,
        name: review.customer_name,
        location: review.location,
        rating: review.rating,
        productName: review.product_name,
        comment: review.comment,
        verified: review.verified,
        helpful: review.helpful_count || 0,
        category:
          (productCategory === "combos"
            ? "both"
            : productCategory?.replaceAll("_", "-")) ||
          (/panjeeri|panjiri/i.test(review.product_name)
            ? "panjeeri"
            : /energy|ladoos?/i.test(review.product_name)
              ? "energy-balls"
              : "both"),
        photoId: review.has_photo ? review.id : undefined,
      };
    });
  const allReviews: CustomerReview[] = [...published, ...WEBSITE_REVIEWS];
  const filters = [
    { id: "all", title: `All Reviews (${allReviews.length})` },
    { id: "panjeeri", title: "Panjeeri" },
    { id: "energy-balls", title: "Energy Balls" },
    { id: "both", title: "Both Products" },
    { id: "photos", title: "With Photo" },
  ];
  const visible = allReviews.filter(
    (review) =>
      category === "all" ||
      (category === "photos"
        ? !!(review.photoId || review.screenshotSource)
        : review.category === category ||
          (category !== "both" && review.category === "both")),
  );
  const share = async (review: CustomerReview) => {
    try {
      await Share.share({
        message: `${review.comment}\n— ${review.name}, ${review.productName}\nhttps://nourishspoon.com/testimonials.html`,
      });
    } catch {}
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header
        title="Customer Reviews"
        showBack
        onBack={onBack || navigation?.goBack}
        rightAction="none"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        <Text style={[s.eyebrow, { color: theme.gold }]}>CUSTOMER LOVE</Text>
        <Text style={[s.heading, { color: theme.text }]}>
          Real Experiences. Real Love.
        </Text>
        <Text style={[s.intro, { color: theme.textSecondary }]}>
          Feedback from our customers and verified app purchases.
        </Text>
        {navigation && (
          <GreenButton
            title="Review a delivered order"
            onPress={() => navigation.navigate("Orders")}
          />
        )}
        <View style={s.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              accessibilityRole="button"
              accessibilityLabel={filter.title}
              accessibilityState={{ selected: category === filter.id }}
              onPress={() => setCategory(filter.id)}
              style={[
                s.filter,
                {
                  borderColor: theme.border,
                  backgroundColor:
                    category === filter.id ? "#1B4332" : theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  s.filterText,
                  { color: category === filter.id ? "#fff" : theme.text },
                ]}
              >
                {filter.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {visible.map((review) => (
          <CustomerReviewCard
            key={review.id}
            review={review}
            theme={theme}
            voted={!!voted[review.id]}
            onVote={() =>
              setVoted((previous) => ({
                ...previous,
                [review.id]: !previous[review.id],
              }))
            }
            onShare={() => share(review)}
            onOpenMedia={setMedia}
          />
        ))}
        {!visible.length && (
          <Text style={[s.intro, { color: theme.textSecondary }]}>
            No approved reviews in this category yet.
          </Text>
        )}
      </ScrollView>
      <Modal
        visible={!!media}
        transparent
        animationType="fade"
        onRequestClose={() => setMedia(null)}
      >
        <View style={s.overlay}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Dismiss review photo"
            onPress={() => setMedia(null)}
            style={StyleSheet.absoluteFill}
          />
          <View
            accessibilityViewIsModal
            style={[s.modal, { backgroundColor: theme.surface }]}
          >
            <View style={s.modalHeading}>
              <Text style={[s.modalTitle, { color: theme.text }]}>
                {media?.name}’s Review
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close review photo"
                onPress={() => setMedia(null)}
                style={s.close}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            {media && (
              <Image
                source={media.source}
                style={{ width: "100%", height: height * 0.62 }}
                resizeMode="contain"
                accessibilityLabel={`Full review image from ${media.name}`}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  eyebrow: {
    fontFamily: REVIEW_FONTS.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 14,
  },
  heading: {
    fontFamily: REVIEW_FONTS.display,
    fontSize: 27,
    lineHeight: 37,
    textAlign: "center",
    marginTop: 5,
    paddingBottom: 5,
  },
  intro: {
    fontFamily: REVIEW_FONTS.regular,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 16,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  filter: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: { fontFamily: REVIEW_FONTS.bold, fontSize: 12 },
  overlay: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    borderRadius: 16,
    padding: 14,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  modalHeading: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalTitle: {
    fontFamily: REVIEW_FONTS.display,
    flex: 1,
    fontSize: 22,
    lineHeight: 30,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
