import { Header } from "../components/Header";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "../components/DesignPrimitives";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { useStore } from "../services/storeService";
import { ASSETS } from "../constants/assets";
import { BottomTabBar } from "../components/BottomTabBar";

interface FAQScreenProps {
  navigation: any;
}

export const FAQScreen: React.FC<FAQScreenProps> = ({ navigation }) => {
  const { currentTheme, faqs, settings } = useStore();
  const colors = currentTheme;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(
    faqs[0]?.id || null,
  );

  const categories = [
    { id: "all", label: "General" },
    { id: "products", label: "Products" },
    { id: "ordering", label: "Ordering" },
    { id: "delivery", label: "Delivery" },
    { id: "gifting", label: "Gifting" },
  ];

  const quickBadges = [
    { title: "Fast Replies", subtitle: "via WhatsApp", icon: "whatsapp" },
    { title: "Sargodha", subtitle: "Same-Day Delivery", icon: "truck" },
    { title: "100%", subtitle: "Natural", icon: "leaf" },
    { title: "Nationwide", subtitle: "2–3 Days", icon: "cube" },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    if (activeCategory === "all") return true;
    return faq.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleWhatsAppHelp = () => {
    const phone = settings.whatsapp_number.replace(/[^0-9]/g, "");
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      "Assalam-o-Alaikum! I have a question regarding Nourish Spoon products.",
    )}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(
            `https://wa.me/${phone}?text=${encodeURIComponent(
              "Assalam-o-Alaikum! I have a question regarding Nourish Spoon products.",
            )}`,
          );
        }
      })
      .catch(() => {});
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.isDark ? "light-content" : "dark-content"} />

      <Header showBack onBack={navigation.goBack} rightAction="none" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.primary }]}>
            Frequently Asked Questions
          </Text>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            Find quick answers to common questions about our products, orders
            and more.
          </Text>
        </View>

        {/* 4 Quick Badges */}
        <View style={styles.quickBadgesRow}>
          {quickBadges.map((badge, idx) => (
            <View
              key={idx}
              style={[
                styles.quickBadgeCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <FontAwesome
                name={badge.icon as any}
                size={23}
                color={colors.primary}
                style={{ marginBottom: 6 }}
              />
              <Text style={[styles.quickBadgeTitle, { color: colors.text }]}>
                {badge.title}
              </Text>
              <Text
                style={[styles.quickBadgeSub, { color: colors.textSecondary }]}
              >
                {badge.subtitle}
              </Text>
            </View>
          ))}
        </View>

        {/* Categories Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsList}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  styles.chipBtn,
                  isSelected
                    ? {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipBtnText,
                    isSelected ? { color: "#FFF" } : { color: colors.text },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FAQ Accordion List */}
        <View style={styles.faqList}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <TouchableOpacity
                key={faq.id}
                accessibilityRole="button"
                accessibilityLabel={faq.question}
                accessibilityState={{ expanded: isExpanded }}
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.85}
                style={[
                  styles.faqCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isExpanded ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={styles.faqCardHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.primary }]}>
                    {faq.question}
                  </Text>
                  <View
                    style={[
                      styles.expandIconCircle,
                      { backgroundColor: isExpanded ? "#EBF5EE" : colors.card },
                    ]}
                  >
                    <Text
                      style={[
                        styles.expandIcon,
                        {
                          color: isExpanded
                            ? colors.primary
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {isExpanded ? "—" : "+"}
                    </Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <View
                      style={[
                        styles.faqDivider,
                        { backgroundColor: colors.border },
                      ]}
                    />
                    <Text
                      style={[
                        styles.faqAnswer,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ask on WhatsApp Banner */}
        <TouchableOpacity
          onPress={handleWhatsAppHelp}
          activeOpacity={0.9}
          style={[styles.askWhatsAppCard, { borderColor: "#BDE3C8" }]}
        >
          <View style={styles.askContent}>
            <View style={styles.whatsappIconCircle}>
              <FontAwesome name="whatsapp" size={25} color="#fff" />
            </View>
            <View style={styles.askTextCol}>
              <Text style={styles.askHint}>Didn't find your answer?</Text>
              <Text style={styles.askHeadline}>Ask on WhatsApp.</Text>
              <Text style={styles.askSubtext}>
                Our team is happy to help you with any questions about orders,
                products or custom requests.
              </Text>
            </View>
          </View>
          <View style={styles.arrowCircleBtn}>
            <Text style={styles.arrowCircleBtnText}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "300",
    marginTop: -2,
  },
  headerLogo: {
    width: 130,
    height: 36,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "serif",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 30,
  },
  subTitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  quickBadgesRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickBadgeCard: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickBadgeIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  quickBadgeTitle: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  quickBadgeSub: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
  categoryChipsList: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  chipBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  faqList: {
    paddingHorizontal: 16,
  },
  faqCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  faqCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "serif",
    lineHeight: 20,
    paddingRight: 10,
  },
  expandIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: "700",
  },
  faqAnswerContainer: {
    marginTop: 12,
  },
  faqDivider: {
    height: 1,
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 20,
  },
  askWhatsAppCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#F3F9F5",
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  askContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    paddingRight: 10,
  },
  whatsappIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  whatsappIconText: {
    fontSize: 22,
  },
  askTextCol: {
    flex: 1,
  },
  askHint: {
    fontSize: 11,
    color: "#666",
  },
  askHeadline: {
    fontSize: 16,
    fontWeight: "800",
    color: "#073B21",
    fontFamily: "serif",
    marginBottom: 4,
  },
  askSubtext: {
    fontSize: 11,
    color: "#4B5563",
    lineHeight: 15,
  },
  arrowCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#073B21",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowCircleBtnText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: -2,
  },
});
