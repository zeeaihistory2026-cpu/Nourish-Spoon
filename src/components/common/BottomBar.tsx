import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme';

interface BottomBarProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function BottomBar({ children, style }: BottomBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) + 12 }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.borderHair,
    paddingHorizontal: 18,
    paddingTop: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
});
