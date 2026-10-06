import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '../../theme';

interface ScreenProps {
  children: ReactNode;
  barStyle?: 'light' | 'dark';
  centered?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  barStyle = 'dark',
  centered = false,
  edges = ['top', 'left', 'right'],
  style,
}: ScreenProps) {
  return (
    <SafeAreaView style={[styles.screen, centered && styles.centered, style]} edges={edges}>
      <StatusBar style={barStyle} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
