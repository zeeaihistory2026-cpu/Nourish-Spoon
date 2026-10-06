import { Leaf } from 'lucide-react-native';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { BRAND } from '../../../constants';
import { FONT_FAMILY, colors } from '../../../theme';

// Large brand hero used at the top of the auth screens: sprout, wordmark,
// tagline and the small sprout divider, over soft leaf decor.
export function AuthHero() {
  return (
    <View style={styles.block}>
      <View style={styles.sproutWrap}>
        <Leaf size={17} color={colors.greenDark} strokeWidth={2} style={styles.leafLeft} />
        <Leaf size={17} color={colors.greenDark} strokeWidth={2} style={styles.leafRight} />
      </View>
      <AppText style={styles.wordmark}>Nourish{'\n'}Spoon</AppText>
      <AppText style={styles.tagline}>Crafted with Love</AppText>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Leaf size={11} color={colors.goldDark} strokeWidth={2} />
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

// Warm product photo strip closing the auth screens, as in the references.
export function AuthPhotoStrip({ height = 132 }: { height?: number }) {
  return (
    <Image
      source={BRAND.energyBallsImage}
      style={[styles.strip, { height }]}
      contentFit="cover"
      transition={250}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
  },
  sproutWrap: {
    flexDirection: 'row',
    gap: 1,
    marginBottom: -2,
  },
  leafLeft: {
    transform: [{ rotate: '-24deg' }],
  },
  leafRight: {
    transform: [{ rotate: '18deg' }],
  },
  wordmark: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 42,
    lineHeight: 42,
    textAlign: 'center',
    color: colors.greenDark,
  },
  tagline: {
    fontFamily: FONT_FAMILY.display.regularItalic,
    fontSize: 19,
    lineHeight: 24,
    color: colors.goldDark,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  dividerLine: {
    width: 46,
    height: 1,
    backgroundColor: colors.border,
  },
  strip: {
    width: '100%',
  },
});
