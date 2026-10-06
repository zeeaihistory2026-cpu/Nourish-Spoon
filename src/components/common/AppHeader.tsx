import { Bell, ChevronLeft, Menu, Search } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { colors } from '../../theme';
import { LogoBlock } from './LogoBlock';
import { DecorativeLeaves } from './DecorativeLeaves';

interface AppHeaderProps {
  variant?: 'home' | 'title';
  title?: string;
  showSearch?: boolean;
  /** `true` fires the default menu behaviour; pass a function for custom handling. */
  onMenu?: boolean | (() => void);
  onBack?: boolean | (() => void);
  onSearch?: () => void;
  rightIcon?: ReactNode;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
  leaves?: boolean;
}

export function AppHeader({
  variant = 'title',
  title,
  showSearch = false,
  onMenu,
  onBack,
  onSearch,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel,
  leaves = false,
}: AppHeaderProps) {
  const showBack = onBack !== undefined && onBack !== false;
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  if (variant === 'home') {
    return (
      <View style={styles.homeHeader}>
        {leaves ? <DecorativeLeaves /> : null}
        <Pressable
          onPress={typeof onMenu === 'function' ? onMenu : undefined}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
        >
          <Menu size={26} color={colors.greenDark} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.logoWrap}>
          <LogoBlock />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
        >
          <View>
            <Bell size={24} color={colors.greenDark} strokeWidth={2} />
            <View style={styles.bellDot} />
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.titleHeader}>
      {leaves ? <DecorativeLeaves /> : null}
      {showBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
        >
          <ChevronLeft size={26} color={colors.greenDark} strokeWidth={2.4} />
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}
      {title ? (
        <AppText variant="screenTitle" color="greenDark" style={styles.title}>
          {title}
        </AppText>
      ) : null}
      {showSearch ? (
        <Pressable
          onPress={onSearch}
          accessibilityRole="button"
          accessibilityLabel="Search"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
        >
          <Search size={24} color={colors.greenDark} strokeWidth={2.2} />
        </Pressable>
      ) : rightIcon ? (
        <Pressable
          onPress={onRightPress}
          accessibilityRole="button"
          accessibilityLabel={rightAccessibilityLabel ?? 'Action'}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
        >
          {rightIcon}
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    height: 104,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 40,
  },
  bellDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#E5484D',
    borderWidth: 1.5,
    borderColor: colors.cream,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
