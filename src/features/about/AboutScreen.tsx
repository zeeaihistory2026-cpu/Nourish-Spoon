import {
  ChevronRight,
  Heart,
  Package,
  ShieldCheck,
  Soup,
  Sprout,
  Truck,
  Users,
  Leaf,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { DecorativeLeaves } from '../../components/common/DecorativeLeaves';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { DrawerMenu } from '../profile/components/DrawerMenu';
import { BRAND } from '../../constants';
import { FONT_FAMILY, colors, radius, shadows } from '../../theme';

const STEPS = [
  {
    icon: <Sprout size={24} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Source\nPremium\nIngredients',
    body: 'We carefully select the finest nuts, dates and natural ingredients.',
  },
  {
    icon: <Soup size={24} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Prepare\nFresh',
    body: 'Our traditional family recipes are prepared in small batches for the best taste.',
  },
  {
    icon: <Package size={24} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Pack\nAirtight',
    body: 'Hygienically packed to lock in freshness and natural nutrition.',
  },
  {
    icon: <Truck size={24} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Deliver\nto You',
    body: 'Freshly made and delivered direct to your doorstep across Pakistan.',
  },
];

const VALUES = [
  {
    icon: <ShieldCheck size={22} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Quality\nFirst',
    body: 'Only the best ingredients make it to our jars.',
  },
  {
    icon: <Sprout size={22} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Honest\nNutrition',
    body: 'Real ingredients. No shortcuts. No refined sugar.',
  },
  {
    icon: <Heart size={22} color="#E5484D" strokeWidth={1.8} />,
    title: 'Made\nwith Love',
    body: 'Crafted with care, just like our family recipes.',
  },
  {
    icon: <Leaf size={22} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Natural\nAlways',
    body: '100% natural, wholesome ingredients.',
  },
  {
    icon: <Users size={22} color={colors.greenDark} strokeWidth={1.8} />,
    title: 'Transparent',
    body: 'We believe in honesty, from our kitchen to your home.',
  },
];

export function AboutScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Screen>
      <AppHeader variant="title" title="Our Story" leaves onMenu={() => setDrawerOpen(true)} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={BRAND.storyImage}
            style={styles.heroImage}
            contentFit="cover"
            transition={250}
          />
          <View style={styles.quoteCard}>
            <AppText style={styles.quoteMark}>â€œ</AppText>
            <AppText style={styles.quote}>
              We make every jar as if it's going to our own family.
            </AppText>
            <AppText style={styles.quoteClose}>â€</AppText>
            <View style={styles.quoteRule} />
            <AppText variant="bodySemibold" color="greenDark">
              Tayyaba
            </AppText>
            <AppText variant="small" color="textMid">
              Nourish Spoon{'\n'}Sargodha, Pakistan
            </AppText>
          </View>
        </View>

        <AppText variant="sectionTitleBig" color="greenDark" style={styles.storyTitle}>
          A Story of Family, Food &amp; Purpose
        </AppText>
        <AppText variant="body" color="text" style={styles.storyBody}>
          Nourish Spoon was born from recipes passed down from my mother and grandmother â€”
          timeless traditions made with real, natural ingredients. What started in our home
          kitchen in Sargodha has grown into a mission to share the same warmth, nourishment and
          goodness with families across Pakistan. Every jar carries a piece of our family's love,
          crafted for yours.
        </AppText>

        <AppText variant="sectionTitle" color="greenDark" style={styles.sectionTitle}>
          How We Make It
        </AppText>
        <View style={styles.stepsRow}>
          {STEPS.map((step, index) => (
            <View key={step.title} style={styles.stepWrap}>
              {index > 0 ? (
                <ChevronRight size={14} color={colors.goldDark} strokeWidth={2.4} style={styles.stepChevron} />
              ) : null}
              <View style={styles.step}>
                <View style={styles.stepIcon}>{step.icon}</View>
                <AppText variant="bodySemibold" color="greenDark" style={styles.stepTitle}>
                  {step.title}
                </AppText>
                <AppText variant="microRegular" color="textMid" style={styles.stepBody}>
                  {step.body}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        <AppText variant="sectionTitle" color="greenDark" style={styles.sectionTitle}>
          Our Values
        </AppText>
        <View style={styles.valuesRow}>
          {VALUES.map((value) => (
            <View key={value.title} style={styles.valueTile}>
              <View style={styles.valueIcon}>{value.icon}</View>
              <AppText variant="bodySemibold" color="greenDark" style={styles.valueTitle}>
                {value.title}
              </AppText>
              <AppText variant="microRegular" color="textMid" style={styles.valueBody}>
                {value.body}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  hero: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.imageBg,
    height: 400,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  quoteCard: {
    position: 'absolute',
    top: 54,
    right: 14,
    width: 172,
    backgroundColor: 'rgba(251, 240, 213, 0.94)',
    borderRadius: radius.lg,
    padding: 13,
    ...shadows.sm,
  },
  quoteMark: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 30,
    lineHeight: 30,
    color: colors.goldDark,
  },
  quote: {
    fontFamily: FONT_FAMILY.display.semiboldItalic,
    fontSize: 16,
    lineHeight: 22,
    color: colors.greenDark,
    marginTop: -14,
  },
  quoteClose: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 22,
    lineHeight: 22,
    color: colors.goldDark,
    textAlign: 'right',
    marginTop: -4,
  },
  quoteRule: {
    width: 26,
    height: 2,
    backgroundColor: colors.goldDark,
    marginTop: 8,
    marginBottom: 8,
  },
  storyTitle: {
    marginTop: 18,
  },
  storyBody: {
    marginTop: 8,
    lineHeight: 24,
  },
  sectionTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 6,
    ...shadows.sm,
  },
  stepWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepChevron: {
    marginTop: 16,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
  },
  stepBody: {
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 14,
    fontSize: 9.5,
  },
  valuesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  valueTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTitle: {
    textAlign: 'center',
    marginTop: 7,
    fontSize: 11.5,
    lineHeight: 15,
  },
  valueBody: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 13,
  },
});
