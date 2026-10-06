import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BRAND } from '../../constants';
import { colors } from '../../theme';

// The splash is the brand's full-screen photographic composition: watercolor
// leaves, the drawn logo and the product bowl as one artwork. It scales down
// below the status bar/notch so nothing is covered.
export function SplashScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.artworkWrap, { paddingTop: insets.top }]}>
        <Image
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
