import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { colors } from '../../theme';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<AvatarSize, { box: number; font: number }> = {
  sm: { box: 38, font: 13 },
  md: { box: 48, font: 16 },
  lg: { box: 64, font: 20 },
  xl: { box: 76, font: 24 },
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? '' : '';
  return `${first}${last}`.toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name, size = 'sm', color = colors.greenMid, style }: AvatarProps) {
  const dimensions = SIZES[size];
  const textStyle: StyleProp<TextStyle> = {
    fontSize: dimensions.font,
    color: colors.white,
  };
  return (
    <View
      style={[
        styles.circle,
        { width: dimensions.box, height: dimensions.box, backgroundColor: color },
        style,
      ]}
    >
      <AppText style={textStyle}>{initialsOf(name)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
