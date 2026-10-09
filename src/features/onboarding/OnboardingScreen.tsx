import { Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Leaf, ShoppingBasket, Sprout } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { AnalyticsEvent, trackEvent } from '../../services/analytics/events';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BRAND } from '../../constants';
import { FONT_FAMILY, colors, radius } from '../../theme';

// Slide 1 is the brand's exact reference artwork (Skip, dots and Next are
// baked into it) — invisible tap zones sit over those regions so it stays
// fully interactive while remaining pixel-identical to the design.
// Slides 2 and 3 use the matching native template.
const SLIDES = [
  {
    title: 'Handcrafted\nFamily Recipes',
    body: 'Traditional Panjeeri and energy ball recipes passed down through generations, made fresh weekly.',
  },
  {
    title: 'From Our Kitchen\nto Your Home',
    body: 'Order in a tap and get freshly made goodness delivered to your doorstep across Pakistan.',
  },
];

const TILES = [
  { Icon: Leaf, top: '100%', bottom: 'Natural\nIngredients' },
  { Icon: Sprout, top: 'Handcrafted', bottom: 'Family Recipes' },
  { Icon: ShoppingBasket, top: 'Small Batch', bottom: 'Freshness' },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const insets = useSafeAreaInsets();

  const finish = () => {
    void trackEvent(AnalyticsEvent.ONBOARDING_COMPLETED);
    completeOnboarding();
  };

  // Slide 1 — exact reference artwork with invisible interactive zones.
  if (index === 0) {
    return (
      <View style={styles.artworkScreen}>
        <StatusBar style="dark" />
        <Image
        pointerEvents="none"
          source={BRAND.fullOnboardingImage}
          style={styles.artwork}
          contentFit="cover"
          transition={250}
        />
        {/* Skip (top-right) */}
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          style={styles.skipZone}
        />
        {/* Next (bottom-right pill) — advances to slide 2 */}
        <Pressable
          onPress={() => setIndex(1)}
          accessibilityRole="button"
          accessibilityLabel="Next"
          style={styles.nextZone}
        />
      </View>
    );
  }

  const slide = SLIDES[index - 1];
  const isLast = index === SLIDES.length;

  return (
    <Screen>
      <View style={styles.decorWrap} />
      <Pressable
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding"
        style={styles.skip}
      >
        <AppText variant="bodySemibold" color="text">
          Skip
        </AppText>
      </Pressable>

      <View style={styles.body}>
        <AppText style={styles.title}>{slide.title}</AppText>
        <AppText variant="body" color="text" style={styles.paragraph}>
          {slide.body}
        </AppText>

        <View style={styles.tiles}>
          {TILES.map((tile) => (
            <View key={tile.top} style={styles.tile}>
              <View style={styles.tileIcon}>
                <tile.Icon size={28} color={colors.greenDark} strokeWidth={1.8} />
              </View>
              <AppText variant="microRegular" color="text" style={styles.tileLabel}>
                {tile.top}
                {'\n'}
                {tile.bottom}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <Image
        pointerEvents="none"
        source={BRAND.bowlImage}
        style={styles.photo}
        contentFit="cover"
        transition={250}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) + 18 }]}>
        <View style={styles.dots}>
          {[0, 1, 2].map((position) => (
            <View
              key={position}
              style={[styles.dot, position === index && styles.dotOn]}
            />
          ))}
        </View>
        <Pressable
          onPress={isLast ? finish : () => setIndex((current) => current + 1)}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get started' : 'Next'}
          style={({ pressed }) => [styles.next, pressed && { opacity: 0.9 }]}
        >
          <AppText variant="button" style={{ color: colors.white }}>
            {isLast ? 'Get Started' : 'Next'}
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  artworkScreen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  skipZone: {
    position: 'absolute',
    top: '3.2%',
    right: '5%',
    width: '22%',
    height: '7%',
  },
  nextZone: {
    position: 'absolute',
    bottom: '4.6%',
    right: '6.5%',
    width: '44%',
    height: '10%',
  },
  decorWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  skip: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  body: {
    paddingHorizontal: 26,
    paddingTop: 10,
  },
  title: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 38,
    lineHeight: 45,
    textAlign: 'center',
    color: colors.greenDark,
  },
  paragraph: {
    textAlign: 'center',
    marginTop: 13,
    paddingHorizontal: 10,
    lineHeight: 23,
  },
  tiles: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 24,
  },
  tile: {
    alignItems: 'center',
    width: 96,
  },
  tileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCE5D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    textAlign: 'center',
    marginTop: 9,
    lineHeight: 14,
  },
  photo: {
    flex: 1,
    width: '100%',
    minHeight: 250,
    marginTop: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 14,
    backgroundColor: colors.cream,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.dotInactive,
  },
  dotOn: {
    backgroundColor: colors.greenDark,
  },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 32,
  },
});
