import { ChevronRight, Truck } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../../theme';

interface DeliveryBannerProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function DeliveryBanner({ title, subtitle, onPress }: DeliveryBannerProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.banner, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.iconWrap}>
        <Truck size={24} color={colors.goldLight} strokeWidth={1.9} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 14,
  },
  iconWrap: {
    width: 34,
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1,
  },
});
