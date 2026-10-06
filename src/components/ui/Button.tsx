import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'green' | 'outline' | 'whatsapp';

const GRADIENTS: Record<Exclude<ButtonVariant, 'outline'>, [string, string]> = {
  // Deep gold gradient: white labels pass 4.5:1 on both stops (4.81 / 6.67).
  primary: ['#877021', '#6F5A14'],
  green: ['#2D6A4F', '#1B4332'],
  whatsapp: ['#25D366', '#1EB457'],
};

const SHADOWS: Record<ButtonVariant, ViewStyle> = {
  primary: shadows.gold,
  green: shadows.green,
  whatsapp: shadows.whatsapp,
  outline: shadows.sm,
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'green',
  icon,
  loading = false,
  disabled = false,
  height = 54,
  style,
}: ButtonProps) {
  const isInactive = disabled || loading;
  const labelColor = variant === 'outline' ? colors.greenMid : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed || isInactive ? 0.85 : 1 },
        style,
      ]}
    >
      <View style={[SHADOWS[variant], { borderRadius: radius.pill }]}>
        {variant === 'outline' ? (
          <View style={[styles.fill, { height, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border }]}>
            <ButtonContent label={label} labelColor={labelColor} icon={icon} loading={loading} />
          </View>
        ) : (
          <LinearGradient
            colors={GRADIENTS[variant]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fill, { height }]}
          >
            <ButtonContent label={label} labelColor={labelColor} icon={icon} loading={loading} />
          </LinearGradient>
        )}
      </View>
    </Pressable>
  );
}

function ButtonContent({
  label,
  labelColor,
  icon,
  loading,
}: {
  label: string;
  labelColor: string;
  icon?: ReactNode;
  loading: boolean;
}) {
  if (loading) {
    return <ActivityIndicator color={labelColor} />;
  }
  return (
    <>
      {icon}
      <AppText variant="button" style={{ color: labelColor }}>
        {label}
      </AppText>
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  fill: {
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 24,
  },
});
