import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BRAND } from '../../../constants';
import { colors, radius } from '../../../theme';

export function AuthHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.top, { paddingTop: insets.top }]}>
      <View style={styles.decoGold} />
      <View style={styles.logo}>
        <Image
          source={BRAND.logoImage}
          style={styles.logoImage}
          contentFit="cover"
          transition={150}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    height: 150,
    backgroundColor: colors.greenDark,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  decoGold: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: radius.pill,
    right: -50,
    top: -70,
    backgroundColor: 'rgba(201, 168, 76, 0.22)',
  },
  logo: {
    width: 74,
    height: 74,
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
    borderWidth: 4,
    borderColor: 'rgba(201, 168, 76, 0.4)',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
