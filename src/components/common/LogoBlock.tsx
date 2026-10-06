import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { BRAND } from '../../constants';
import { FONT_FAMILY, colors } from '../../theme';

// Centered brand block: the drawn logo and the "Crafted with Love" tagline.
export function LogoBlock({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.column}>
      <Image
        source={BRAND.logoImage}
        style={compact ? styles.logoCompact : styles.logo}
        resizeMode="contain"
      />
      <AppText style={compact ? styles.taglineCompact : styles.tagline}>
        Crafted with Love
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  logo: {
    width: 118,
    height: 91,
  },
  logoCompact: {
    width: 96,
    height: 74,
  },
  tagline: {
    fontFamily: FONT_FAMILY.display.regularItalic,
    fontSize: 14,
    lineHeight: 17,
    color: colors.goldDark,
    marginTop: -6,
    fontStyle: 'italic',
  },
  taglineCompact: {
    fontFamily: FONT_FAMILY.display.regularItalic,
    fontSize: 11,
    lineHeight: 13,
    color: colors.goldDark,
    marginTop: -5,
    fontStyle: 'italic',
  },
});
