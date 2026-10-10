import { Text } from "../components/DesignPrimitives";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { BottomTabBar } from "../components/BottomTabBar";
import { useMobileStore } from "../services/storeService";
import { ASSETS } from "../constants/assets";

interface CustomerReviewsScreenProps {
  onBack?: () => void;
  navigation?: any;
}

export const CustomerReviewsScreen: React.FC<CustomerReviewsScreenProps> = ({
  onBack,
  navigation,
}) => {
  const { theme } = useMobileStore();
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Energy Balls" | "Panjeeri"
  >("All");
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({
    "rev-1": 18,
    "rev-2": 24,
    "rev-3": 41,
  });
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});
  const [screenshotModalVisible, setScreenshotModalVisible] = useState(false);

  const categories: Array<"All" | "Energy Balls" | "Panjeeri"> = [
    "All",
    "Energy Balls",
    "Panjeeri",
  ];

  const reviewsData = [
    {
      id: "rev-1",
      name: "Misbah",
      avatarType: "image",
      avatarSource: ASSETS.avatarMisbah,
      location: "Pakistan",
      timeAgo: "2 weeks ago",
      rating: 5,
      productName: "Homemade Panjeeri",
      productImage: ASSETS.panjeeriCard,
      comment: "Bht acha ha! JazakAllah mam...",
      hasWhatsAppBubble: true,
      whatsappMessage: "Bht acha ha!\nJazakAllah mam ❤️",
      whatsappTime: "7:24 PM",
      category: "Panjeeri",
    },
    {
      id: "rev-2",
      name: "Rakshanda",
      avatarType: "letter",
      avatarLetter: "R",
      avatarBg: "#0D5428",
      location: "Pakistan",
      timeAgo: "1 month ago",
      rating: 5,
      productName: "Date & Nuts Energy Balls",
      productImage: ASSETS.energyBallsCard,
      comment:
        "Absolutely love the taste, presentation and most importantly the hygienic homemade quality. Highly recommended!",
      hasWhatsAppBubble: false,
      category: "Energy Balls",
    },
    {
      id: "rev-3",
      name: "ShahJehan",
      avatarType: "image",
      avatarSource: ASSETS.avatarShahjehan,
      location: "Pakistan",
      timeAgo: "3 months ago",
      rating: 5,
      productName: "Homemade Panjeeri & Ladoos",
      productImage: ASSETS.panjeeriCard,
      comment:
        "Panjeeri bohat hi mazedar thi and the complimentary ladoos were such a lovely surprise. Fresh, healthy and truly homemade. Highly recommended!",
      hasWhatsAppBubble: false,
      category: "Panjeeri",
    },
  ];

  const filtered = reviewsData.filter((r) => {
    if (selectedCategory === "All") return true;
    return r.category === selectedCategory;
  });

  const toggleHelpful = (id: string) => {
    if (votedHelpful[id]) {
      setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 1) - 1 }));
      setVotedHelpful((prev) => ({ ...prev, [id]: false }));
    } else {
      setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      setVotedHelpful((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleShare = async (review: (typeof reviewsData)[0]) => {
    try {
      await Share.share({
        message: `"${review.comment}" — ${review.name}'s verified review for ${review.productName} at Nourish Spoon.`,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />

      {/* Top Header */}
      <Header
        showBack
        onBack={onBack || (() => navigation?.goBack?.())}
        rightAction="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Tagline */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: theme.text }]}>
            Customer Reviews
          </Text>
          <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
            Real stories. Real nutrition. Real love.
          </Text>
        </View>

        {/* 3 Filter Pills: All | Energy Balls | Panjeeri */}
        <View style={styles.filterRow}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterPill,
                  isActive
                    ? { backgroundColor: "#0D5428", borderColor: "#0D5428" }
                    : {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isActive ? "#FFFFFF" : theme.text,
                      fontWeight: isActive ? "700" : "500",
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Reviews Cards */}
        <View style={styles.reviewsList}>
          {filtered.map((r) => {
            const count = helpfulCounts[r.id] ?? 0;
            const isLiked = votedHelpful[r.id];

            return (
              <View
                key={r.id}
                style={[
                  styles.reviewCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                {/* Header Row: Avatar, Name, Verified Badge, Location, Time */}
                <View style={styles.userRow}>
                  {r.avatarType === "image" ? (
                    <Image
                      source={r.avatarSource}
                      style={styles.avatarImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.avatarLetterCircle,
                        { backgroundColor: r.avatarBg },
                      ]}
                    >
                      <Text style={styles.avatarLetterText}>
                        {r.avatarLetter}
                      </Text>
                    </View>
                  )}

                  <View style={styles.userInfoCol}>
                    <View style={styles.userNameBadgeRow}>
                      <Text style={[styles.userName, { color: "#10271A" }]}>
                        {r.name}
                      </Text>
                      <View style={styles.verifiedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#0D5428"
                        />
                        <Text style={styles.verifiedText}>
                          Verified Purchase
                        </Text>
                      </View>
                    </View>
                    <View style={styles.locationRow}>
                      <Ionicons
                        name="location-outline"
                        size={13}
                        color="#5A6D60"
                      />
                      <Text style={styles.locationText}>{r.location}</Text>
                    </View>
                  </View>

                  <Text style={styles.timeAgoText}>{r.timeAgo}</Text>
                </View>

                {/* 5 Stars */}
                <View style={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={16}
                      color="#E5A93C"
                      style={{ marginRight: 3 }}
                    />
                  ))}
                </View>

                {/* Product Reference Row: Jar Thumbnail + Title + Comment */}
                <View style={styles.productSnippetRow}>
                  <Image
                    source={r.productImage}
                    style={styles.productJarThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.productSnippetTextCol}>
                    <Text style={styles.productSnippetName}>
                      {r.productName}
                    </Text>
                    <Text
                      style={styles.productSnippetComment}
                      numberOfLines={6}
                    >
                      {r.comment}
                    </Text>
                  </View>
                </View>

                {/* WhatsApp Chat Bubble & View Screenshot Button (Misbah Review) */}
                {r.hasWhatsAppBubble && (
                  <View style={styles.whatsappProofRow}>
                    <Image
                      source={ASSETS.reviewWhatsappBubble}
                      style={{
                        flex: 1,
                        height: 44,
                        marginRight: 8,
                        borderRadius: 8,
                      }}
                      resizeMode="contain"
                    />

                    {/* View Screenshot Button */}
                    <TouchableOpacity
                      onPress={() => setScreenshotModalVisible(true)}
                      style={styles.viewScreenshotBtn}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={16}
                        color="#10271A"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.viewScreenshotText}>
                        View Screenshot
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color="#10271A"
                        style={{ marginLeft: 3 }}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Footer Action Buttons: Helpful & Share */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    onPress={() => toggleHelpful(r.id)}
                    style={styles.footerActionBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                      size={17}
                      color={isLiked ? "#0D5428" : "#5A6D60"}
                    />
                    <Text
                      style={[
                        styles.footerActionText,
                        {
                          color: isLiked ? "#0D5428" : "#5A6D60",
                          fontWeight: isLiked ? "700" : "500",
                        },
                      ]}
                    >
                      Helpful ({count})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleShare(r)}
                    style={styles.footerActionBtn}
                    activeOpacity={0.7}
                  >
                    <FontAwesome
                      name="whatsapp"
                      size={18}
                      color="#25D366"
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={[
                        styles.footerActionText,
                        { color: "#10271A", fontWeight: "600" },
                      ]}
                    >
                      Share
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Screenshot Preview Modal */}
      <Modal
        visible={screenshotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScreenshotModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setScreenshotModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verified WhatsApp Feedback</Text>
              <TouchableOpacity
                onPress={() => setScreenshotModalVisible(false)}
              >
                <Ionicons name="close-circle" size={24} color="#10271A" />
              </TouchableOpacity>
            </View>
            <Image
              source={ASSETS.reviewWhatsappBubble}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalFootnote}>
              Authentic customer conversation verified on WhatsApp • Nourish
              Spoon Sargodha
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Tab Bar */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 14,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    fontFamily: "serif",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subTitle: {
    fontSize: 13,
    letterSpacing: 0.1,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  filterPill: {
    flex: 1,
    marginHorizontal: 4,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 13,
  },
  reviewsList: {
    paddingHorizontal: 16,
  },
  reviewCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarLetterCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetterText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "serif",
  },
  userInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  userNameBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    marginRight: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    color: "#0D5428",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: "#5A6D60",
    marginLeft: 2,
  },
  timeAgoText: {
    fontSize: 11,
    color: "#7E9687",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 2,
  },
  productSnippetRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productJarThumb: {
    width: 95,
    height: 72,
    borderRadius: 12,
  },
  productSnippetTextCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productSnippetName: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "serif",
    color: "#10271A",
    marginBottom: 4,
  },
  productSnippetComment: {
    fontSize: 12,
    color: "#4A5568",
    lineHeight: 17,
  },
  whatsappProofRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 2,
  },
  whatsappBubbleCard: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  whatsappGreenCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubbleTextCol: {
    flex: 1,
  },
  bubbleMessageText: {
    fontSize: 11,
    color: "#1A202C",
    fontWeight: "600",
  },
  bubbleMessageSub: {
    fontSize: 10,
    color: "#2D3748",
    marginTop: 1,
  },
  bubbleTime: {
    fontSize: 9,
    color: "#718096",
  },
  viewScreenshotBtn: {
    backgroundColor: "#FDF6E2",
    borderColor: "#EBDCB9",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  viewScreenshotText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10271A",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F0E8D7",
    paddingTop: 10,
    marginTop: 4,
  },
  footerActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  footerActionText: {
    fontSize: 12,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "serif",
    color: "#10271A",
  },
  modalImage: {
    width: "100%",
    height: 180,
  },
  modalFootnote: {
    fontSize: 11,
    color: "#7E9687",
    textAlign: "center",
    marginTop: 12,
  },
});
