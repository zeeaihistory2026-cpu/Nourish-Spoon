import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { BRAND } from '../../constants';
import { colors } from '../../theme';

// The splash is the brand's full-screen photographic composition: watercolor
// leaves, the drawn logo and the product bowl as one artwork. It renders
// full-bleed under the status bar, exactly like the approved design mockup.
export function SplashScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.artworkWrap}>
        <Image
        pointerEvents="none"
          source={BRAND.fullSplashImage}
          style={styles.art}
          contentFit="contain"
          transition={250}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  artworkWrap: {
    flex: 1,
  },
  art: {
    width: '100%',
    height: '100%',
  },
});
