import { Bell, ChevronLeft, Menu, Search } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppText } from '../ui/AppText';
import { colors } from '../../theme';
import type { RootNavigationProp } from '../../app/navigation/navigationTypes';
import { LogoBlock } from './LogoBlock';
import { DecorativeLeaves } from './DecorativeLeaves';

interface AppHeaderProps {
  variant?: 'home' | 'title';
  title?: string;
  showSearch?: boolean;
  /** Pass a function for custom handling; `true` renders the button with no-op. */
  onMenu?: boolean | (() => void);
  /** `true` fires the default back behaviour (`navigation.goBack()`); pass a function for custom handling. */
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
  const navigation = useNavigation<RootNavigationProp>();
  const showBack = onBack !== undefined && onBack !== false;
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else if (onBack === true) {
      // Bare `onBack` (the common call-site pattern) falls back to goBack(),
      // so the rendered chevron is never a dead button.
      navigation.goBack();
    }
  };
  const handleMenu = () => {
    if (typeof onMenu === 'function') {
      onMenu();
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
          onPress={() => navigation.navigate('Notifications')}
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
      ) : onMenu ? (
        <Pressable
          onPress={handleMenu}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
        >
          <Menu size={26} color={colors.greenDark} strokeWidth={2.2} />
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
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.cream,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
