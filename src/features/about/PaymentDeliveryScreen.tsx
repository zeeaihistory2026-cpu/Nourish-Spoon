import { Landmark, ChevronRight, Store, Truck } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/common/AppHeader';
import { DecorativeLeaves } from '../../components/common/DecorativeLeaves';
import { LogoBlock } from '../../components/common/LogoBlock';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { colors, radius, shadows } from '../../theme';

interface OptionRow {
  key: string;
  title: string;
  body: string;
  badge: () => ReactNode;
}

const PAYMENT_METHODS: OptionRow[] = [
  {
    key: 'bank',
    title: 'Bank Transfer',
    body: 'Direct bank transfer to our official account. Secure and easy.',
    badge: () => <Landmark size={24} color="#2F6FED" strokeWidth={1.9} />,
  },
  {
    key: 'easypaisa',
    title: 'EasyPaisa',
    body: 'Quick and secure payment via EasyPaisa mobile wallet.',
    badge: () => (
      <View style={[styles.brandCircle, { backgroundColor: '#57BB48' }]}>
        <AppText style={styles.brandLetter}>e</AppText>
      </View>
    ),
  },
  {
    key: 'jazzcash',
    title: 'JazzCash',
    body: 'Pay easily through JazzCash mobile wallet.',
    badge: () => (
      <View style={[styles.brandCircle, { backgroundColor: '#1A1A1A' }]}>
        <AppText style={styles.brandWord}>Jazz</AppText>
        <AppText style={[styles.brandWord, { color: '#E4344B' }]}>Cash</AppText>
      </View>
    ),
  },
];

const DELIVERY_OPTIONS: OptionRow[] = [
  {
    key: 'sameday',
    title: 'Same-day delivery in Sargodha',
    body: 'Freshly made and delivered to your doorstep on the same day.',
    badge: () => <Truck size={24} color={colors.greenDark} strokeWidth={1.9} />,
  },
  {
    key: 'tcs',
    title: 'Nationwide delivery via TCS',
    body: '2–3 working days across Pakistan. Safe and reliable delivery.',
    badge: () => (
      <View style={[styles.brandCircle, { backgroundColor: 'transparent' }]}>
        <AppText style={styles.tcsWord}>TCS</AppText>
      </View>
    ),
  },
  {
    key: 'foodpanda',
    title: 'Foodpanda in Sargodha',
    body: 'Order through Foodpanda for quick delivery in Sargodha.',
    badge: () => (
      <View style={[styles.brandCircle, { backgroundColor: '#D70F64' }]}>
        <AppText style={styles.brandLetter}>🐼</AppText>
      </View>
    ),
  },
  {
    key: 'pickup',
    title: 'Self Pickup (Sargodha)',
    body: 'Collect your order from our kitchen in Sargodha at your convenience.',
    badge: () => <Store size={24} color={colors.greenDark} strokeWidth={1.9} />,
  },
];

export function PaymentDeliveryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 8) + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader variant="title" onBack leaves />
        <View style={styles.brandBlock}>
          <LogoBlock />
        </View>
        <AppText variant="sectionTitleBig" color="greenDark" style={styles.pageTitle}>
          Payment &amp; Delivery
        </AppText>
        <AppText variant="body" color="textMid" style={styles.pageSubtitle}>
          Secure and convenient options for your orders.
        </AppText>

        <View style={styles.card}>
          <AppText variant="sectionTitle" color="greenDark">
            Payment Method
          </AppText>
          <AppText variant="body" color="text" style={styles.cardSubtitle}>
            (Advance Payment Only)
          </AppText>
          {PAYMENT_METHODS.map((option) => (
            <OptionRowView key={option.key} option={option} />
          ))}
          <View style={styles.noCodBanner}>
            <View style={styles.infoIcon}>
              <AppText style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>i</AppText>
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodySemibold" color="greenDark">
                We do not offer Cash on Delivery.
              </AppText>
              <AppText variant="small" color="textMid">
                Orders are confirmed after advance payment.
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <AppText variant="sectionTitle" color="greenDark">
            Delivery Options
          </AppText>
          <AppText variant="body" color="textMid" style={styles.cardSubtitle}>
            Choose a delivery method that works best for you.
          </AppText>
          {DELIVERY_OPTIONS.map((option) => (
            <OptionRowView key={option.key} option={option} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function OptionRowView({ option }: { option: OptionRow }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <View style={styles.rowBadge}>{option.badge()}</View>
      <View style={styles.rowBody}>
        <AppText variant="bodySemibold" color="greenDark">
          {option.title}
        </AppText>
        <AppText variant="small" color="textMid" style={styles.rowBodyText}>
          {option.body}
        </AppText>
      </View>
      <ChevronRight size={19} color={colors.textLight} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: -6,
  },
  pageTitle: {
    textAlign: 'center',
    marginTop: 6,
  },
  pageSubtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    marginTop: 16,
    ...shadows.sm,
  },
  cardSubtitle: {
    marginTop: 2,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 12,
    marginTop: 10,
  },
  rowBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowBodyText: {
    marginTop: 2,
    lineHeight: 18,
  },
  brandCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  brandLetter: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  brandWord: {
    color: colors.white,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tcsWord: {
    color: '#E4344B',
    fontSize: 13,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  noCodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#FBF0D5',
    borderRadius: radius.lg,
    padding: 13,
    marginTop: 12,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
