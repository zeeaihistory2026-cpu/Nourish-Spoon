import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { Button } from './Button';
import { colors, radius, shadows } from '../../theme';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>{icon}</View>
      <AppText variant="sectionTitle" color="greenDark" style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" color="textMid" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="green" height={48} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  circle: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  title: {
    marginTop: 18,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 260,
  },
  action: {
    marginTop: 20,
    width: 200,
  },
});
