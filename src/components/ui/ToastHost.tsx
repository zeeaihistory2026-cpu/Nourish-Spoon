import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';

import { AppText } from './AppText';
import { useToastStore } from './toastStore';
import { colors, radius, shadows } from '../../theme';

const VISIBLE_MS = 2200;

/**
 * Renders the global toast. Mount once near the root (inside
 * `AppProviders`, above the navigation container) so it floats over
 * every screen, including above the bottom tab bar.
 */
export function ToastHost() {
  const message = useToastStore((s) => s.message);
  const seq = useToastStore((s) => s.seq);
  const hide = useToastStore((s) => s.hide);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
    timer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 8, duration: 200, useNativeDriver: true }),
      ]).start(() => hide());
    }, VISIBLE_MS);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
    // Re-run on seq so repeating the same message re-triggers the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, seq]);

  if (!message) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[styles.host, { bottom: insets.bottom + 96 }]}>
      <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
        <CheckCircle2 size={18} color={colors.white} strokeWidth={2.2} />
        <AppText variant="bodyMedium" color="white" numberOfLines={2}>
          {message}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: '86%',
    ...shadows.lg,
  },
});
