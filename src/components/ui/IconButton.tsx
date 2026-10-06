import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, shadows } from '../../theme';

interface IconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  badge?: number;
  accessibilityLabel: string;
  hidden?: boolean;
}

export function IconButton({ icon, onPress, badge, accessibilityLabel, hidden }: IconButtonProps) {
  if (hidden) {
    return <View style={styles.container} />;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.7 }]}
    >
      {icon}
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <AppText variant="micro" style={styles.badgeText}>
            {badge > 9 ? '9+' : badge}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
  },
});
