import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { BRAND } from '../../../constants';
import { colors, radius } from '../../../theme';

interface HeroBannerProps {
  onOrder: () => void;
}

export function HeroBanner({ onOrder }: HeroBannerProps) {
  return (
    <View style={styles.banner}>
      <Image
        source={BRAND.bowlImage}
        style={styles.image}
        contentFit="cover"
        transition={250}
      />
      <LinearGradient
        colors={['rgba(27, 67, 50, 0.88)', 'rgba(27, 67, 50, 0.4)', 'rgba(27, 67, 50, 0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.text}>
        <AppText variant="heroTitle" style={{ color: colors.white }}>
          Handcrafted Nutrition
        </AppText>
        <AppText variant="small" style={{ color: 'rgba(255, 255, 255, 0.82)' }}>
          Small-batch Â· zero preservatives
        </AppText>
        <Pressable onPress={onOrder} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}>
          <AppText variant="micro" style={{ color: colors.white }}>
            Order Now
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 140,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: colors.imageBg,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  text: {
    position: 'absolute',
    left: 18,
    top: 0,
    bottom: 0,
    maxWidth: '62%',
    justifyContent: 'center',
    gap: 5,
  },
  cta: {
    marginTop: 7,
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: radius.pill,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
