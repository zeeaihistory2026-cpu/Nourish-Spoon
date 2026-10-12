import React, { useState } from "react";
import { Image, Modal, ScrollView, Share, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { Text } from "../components/DesignPrimitives";
import { useMobileStore } from "../services/storeService";
import { WEBSITE_REVIEWS, WebsiteReview } from "../data/websiteReviews";

export function CustomerReviewsScreen({ onBack, navigation }: { onBack?: () => void; navigation?: any }) {
  const { theme, reviews } = useMobileStore();
  const { height } = useWindowDimensions();
  const [category, setCategory] = useState("all");
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [screenshot, setScreenshot] = useState<WebsiteReview | null>(null);
  const filters = [{ id: "all", title: "All" }, { id: "energy-balls", title: "Energy Balls" }, { id: "panjeeri", title: "Panjeeri" }];
  const visible = WEBSITE_REVIEWS.filter(review => category === "all" || review.category === category || review.category === "both");
  const share = async (review: WebsiteReview) => {
    try { await Share.share({ message: `${review.comment}\n— ${review.name}, ${review.productName}\nhttps://nourishspoon.com/testimonials.html` }); } catch {}
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Customer Reviews" showBack onBack={onBack || navigation?.goBack} rightAction="none" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <Text style={[s.eyebrow, { color: theme.gold }]}>CUSTOMER LOVE</Text>
        <Text style={[s.heading, { color: theme.text }]}>Real Experiences. Real Love.</Text>
        <Text style={[s.intro, { color: theme.textSecondary }]}>Customer feedback from Nourish Spoon’s website.</Text>
        <View style={s.filters}>
          {filters.map(filter => (
            <TouchableOpacity key={filter.id} accessibilityRole="button" accessibilityLabel={filter.title} accessibilityState={{ selected: category === filter.id }} onPress={() => setCategory(filter.id)} style={[s.filter, { borderColor: theme.gold, backgroundColor: category === filter.id ? "#1B4332" : theme.surface }]}>
              <Text style={{ color: category === filter.id ? "#fff" : theme.text, fontSize: 12, fontWeight: "700" }}>{filter.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {reviews.filter(review => review.status === 'approved' && !WEBSITE_REVIEWS.some(website => website.id === review.id) && (category === 'all' || (category === 'panjeeri' ? review.product_name.includes('Panjeeri') : !review.product_name.includes('Panjeeri')))).map(review => <View key={review.id} style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border, borderTopColor: theme.gold }]}><Text style={{ fontSize: 16, fontWeight: '700' }}>{review.customer_name} · {review.rating}★</Text><Text style={{ fontSize: 12, color: theme.primary }}>Verified purchase · {review.product_name}</Text><Text style={[s.comment, { color: theme.textSecondary }]}>{review.comment}</Text></View>)}
        {visible.map(review => (
          <View key={review.id} style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border, borderTopColor: theme.gold }]}>
            <View style={s.author}>
              <View style={[s.avatar, { backgroundColor: "#1B4332" }]}><Text style={{ color: "#fff", fontWeight: "700", fontSize: 21 }}>{review.name[0]}</Text></View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 16 }}>{review.name}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{review.location}</Text>
              </View>
              {review.verified && <View style={s.verified}><Ionicons name="checkmark-circle" size={14} color={theme.primary} /><Text style={{ color: theme.primary, fontSize: 11 }}>Verified</Text></View>}
            </View>
            <View style={s.stars}>{Array.from({ length: 5 }, (_, i) => <Ionicons key={i} name={i < review.rating ? "star" : "star-outline"} color={theme.gold} size={16} />)}</View>
            <View style={[s.tag, { backgroundColor: theme.goldWarm }]}><Text style={{ fontSize: 11, color: theme.primary }}>{review.productName}</Text></View>
            <Text style={[s.headline, { color: theme.text }]}>{review.headline}</Text>
            <Text style={[s.comment, { color: theme.textSecondary }]}>{review.comment}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={`View screenshot from ${review.name} for ${review.productName}`} onPress={() => setScreenshot(review)} style={[s.proof, { borderColor: theme.border, backgroundColor: theme.surfaceWarm }]}>
              <Image source={review.screenshotSource} style={s.thumb} resizeMode="cover" />
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.gold, fontSize: 9, letterSpacing: 1 }}>WHATSAPP SCREENSHOT</Text>
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 12, marginTop: 3 }}>View Screenshot</Text>
              </View>
              <Ionicons name="expand-outline" size={18} color={theme.primary} />
            </TouchableOpacity>
            <View style={[s.footer, { borderColor: theme.border }]}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Helpful review by ${review.name}: ${review.helpful + (voted[review.id] ? 1 : 0)}`} accessibilityState={{ selected: !!voted[review.id] }} onPress={() => setVoted(prev => ({ ...prev, [review.id]: !prev[review.id] }))} style={s.action}>
                <Ionicons name={voted[review.id] ? "thumbs-up" : "thumbs-up-outline"} size={17} color={theme.primary} />
                <Text style={{ color: theme.primary, fontSize: 12 }}>Helpful ({review.helpful + (voted[review.id] ? 1 : 0)})</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Share review by ${review.name}`} onPress={() => share(review)} style={s.action}>
                <Ionicons name="share-outline" size={18} color={theme.primary} /><Text style={{ color: theme.primary, fontSize: 12 }}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal visible={!!screenshot} transparent animationType="fade" onRequestClose={() => setScreenshot(null)}>
        <View style={s.overlay}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dismiss review screenshot" onPress={() => setScreenshot(null)} style={StyleSheet.absoluteFill} />
          <View accessibilityViewIsModal style={[s.modal, { backgroundColor: theme.surface }]}>
            <View style={s.author}>
              <Text style={{ flex: 1, color: theme.text, fontFamily: "serif", fontWeight: "700", fontSize: 22 }}>{screenshot?.name}’s Review</Text>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close review screenshot" onPress={() => setScreenshot(null)} style={s.close}><Ionicons name="close" size={24} color={theme.text} /></TouchableOpacity>
            </View>
            {screenshot && <Image source={screenshot.screenshotSource} style={{ width: "100%", height: height * 0.62 }} resizeMode="contain" accessibilityLabel={`Published WhatsApp feedback from ${screenshot.name}`} />}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textAlign: "center", marginTop: 14 },
  heading: { fontFamily: "serif", fontSize: 27, fontWeight: "700", textAlign: "center", marginTop: 5 },
  intro: { fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 5, marginBottom: 16 },
  filters: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filter: { flex: 1, minHeight: 40, borderWidth: 1, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  card: { borderWidth: 1, borderTopWidth: 3, borderRadius: 16, padding: 16, marginBottom: 16 },
  author: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  verified: { flexDirection: "row", alignItems: "center", gap: 3 },
  stars: { flexDirection: "row", gap: 2, marginTop: 12, marginBottom: 10 },
  tag: { alignSelf: "flex-start", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  headline: { fontFamily: "serif", fontWeight: "700", fontSize: 20, lineHeight: 25, marginTop: 12 },
  comment: { fontSize: 13, lineHeight: 21, marginTop: 8, marginBottom: 14 },
  proof: { flexDirection: "row", alignItems: "center", gap: 9, borderWidth: 1, borderRadius: 10, padding: 8 },
  thumb: { width: 50, height: 58, borderRadius: 6 },
  footer: { borderTopWidth: 1, marginTop: 14, paddingTop: 4, flexDirection: "row", justifyContent: "space-between" },
  action: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 6 },
  overlay: { flex: 1, backgroundColor: "#00000090", justifyContent: "center", padding: 16 },
  modal: { borderRadius: 16, padding: 14, maxWidth: 520, width: "100%", alignSelf: "center" },
  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
