import { Minus, Plus } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { CategoryChips } from '../../components/common/CategoryChips';
import { DecorativeLeaves } from '../../components/common/DecorativeLeaves';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { BRAND } from '../../constants';
import { FONT_FAMILY, colors, radius, shadows } from '../../theme';
import { openWhatsApp } from '../../utils/whatsapp';

const QUICK_FACTS = [
  { icon: '💬', top: 'Fast Replies', bottom: 'via WhatsApp' },
  { icon: '🚚', top: 'Sargodha', bottom: 'Same-Day Delivery' },
  { icon: '🍃', top: '100%', bottom: 'Natural' },
  { icon: '📦', top: 'Nationwide', bottom: '2–3 Days' },
];

const FILTERS = ['General', 'Products', 'Ordering', 'Delivery', 'Gifting'];

interface FaqEntry {
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqEntry[] = [
  {
    category: 'General',
    question: 'What is Nourish Spoon?',
    answer:
      'Nourish Spoon is a home-grown brand offering premium Panjeeri, Date & Nut Energy Balls and healthy traditional recipes made with pure, natural ingredients — crafted with love for your family’s well-being.',
  },
  {
    category: 'Products',
    question: 'Are your products 100% natural?',
    answer:
      'Yes. Every jar is made with pure desi ghee, premium nuts and dates — no preservatives, no refined sugar and nothing artificial, ever.',
  },
  {
    category: 'Ordering',
    question: 'How do I place an order?',
    answer:
      'Add items to your cart and check out in the app, or tap “Order on WhatsApp” on any product to order directly with our team.',
  },
  {
    category: 'Ordering',
    question: 'What payment methods do you accept?',
    answer:
      'We accept advance payment via Bank Transfer, EasyPaisa and JazzCash. Orders are confirmed after advance payment — we do not offer Cash on Delivery.',
  },
  {
    category: 'Delivery',
    question: 'Do you ship across Pakistan?',
    answer:
      'We offer same-day delivery within Sargodha and nationwide delivery via TCS in 2–3 working days. Foodpanda delivery is also available in Sargodha.',
  },
  {
    category: 'Gifting',
    question: 'Do you offer gift packaging?',
    answer:
      'Yes! Select “This is a gift order” at checkout and add a personalized message — we’ll pack it beautifully for your loved ones.',
  },
];

export function FaqScreen() {
  const [filter, setFilter] = useState('General');
  const [openQuestion, setOpenQuestion] = useState<string | null>(FAQS[0]?.question ?? null);

  const visible = FAQS.filter((entry) => filter === 'General' || entry.category === filter);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrap}>
          <DecorativeLeaves />
          <AppHeader variant="title" onBack leaves={false} />
          <AppText style={styles.wordmark}>Nourish{'\n'}Spoon</AppText>
          <AppText style={styles.tagline}>Crafted with Love</AppText>
          <AppText variant="sectionTitleBig" color="greenDark" style={styles.title}>
            Frequently Asked{'\n'}Questions
          </AppText>
          <AppText variant="body" color="textMid" style={styles.subtitle}>
            Find quick answers to common questions{'\n'}about our products, orders and more.
          </AppText>
        </View>

        <View style={styles.quickRow}>
          {QUICK_FACTS.map((fact) => (
            <View key={fact.top} style={styles.quickTile}>
              <AppText style={{ fontSize: 20 }}>{fact.icon}</AppText>
              <AppText variant="microRegular" color="text" style={styles.quickLabel}>
                {fact.top}
                {'\n'}
                {fact.bottom}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.chipsRow}>
          <CategoryChips categories={FILTERS} value={filter} onChange={setFilter} />
        </View>

        {visible.map((entry) => {
          const open = openQuestion === entry.question;
          return (
            <Pressable
              key={entry.question}
              onPress={() => setOpenQuestion(open ? null : entry.question)}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.9 }]}
            >
              <View style={styles.itemHeader}>
                <AppText style={styles.question}>{entry.question}</AppText>
                <View style={styles.itemTail}>
                  {open ? (
                    <Minus size={19} color={colors.text} strokeWidth={2.2} />
                  ) : (
                    <Plus size={19} color={colors.text} strokeWidth={2.2} />
                  )}
                </View>
              </View>
              {open ? (
                <AppText variant="body" color="textMid" style={styles.answer}>
                  {entry.answer}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => void openWhatsApp(`Hi ${BRAND.name}! I have a question that isn't in the FAQ.`)}
          style={({ pressed }) => [styles.askCard, pressed && { opacity: 0.94 }]}
          accessibilityRole="button"
          accessibilityLabel="Ask on WhatsApp"
        >
          <Image
            source={BRAND.energyBallsImage}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.askScrim} />
          <View style={styles.askContent}>
            <View style={styles.askIcon}>
              <AppText style={{ color: colors.white, fontSize: 20 }}>💬</AppText>
            </View>
            <View style={styles.askBody}>
              <AppText variant="small" color="text">
                Didn't find your answer?
              </AppText>
              <AppText style={styles.askTitle}>Ask on WhatsApp.</AppText>
              <AppText variant="microRegular" color="textMid">
                Our team is happy to help you with any questions about orders, products or custom
                requests.
              </AppText>
            </View>
            <View style={styles.askChevron}>
              <AppText style={{ color: colors.white, fontSize: 15 }}>›</AppText>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  headerWrap: {
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 24,
    lineHeight: 23,
    textAlign: 'center',
    color: colors.greenDark,
    marginTop: 2,
  },
  tagline: {
    fontFamily: FONT_FAMILY.display.regularItalic,
    fontSize: 13,
    lineHeight: 16,
    color: colors.goldDark,
    marginTop: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 18,
    marginTop: 16,
  },
  quickTile: {
    flex: 1,
    backgroundColor: colors.goldBg,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  quickLabel: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 13,
  },
  chipsRow: {
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 2,
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginHorizontal: 18,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 15,
    ...shadows.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 19,
    lineHeight: 24,
    color: colors.text,
  },
  itemTail: {
    width: 34,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.borderRow,
  },
  answer: {
    marginTop: 10,
    lineHeight: 22,
  },
  askCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginHorizontal: 18,
    marginTop: 16,
    height: 128,
  },
  askScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(253, 246, 227, 0.82)',
  },
  askContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  askIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askBody: {
    flex: 1,
  },
  askTitle: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 20,
    lineHeight: 25,
    color: colors.greenDark,
  },
  askChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
