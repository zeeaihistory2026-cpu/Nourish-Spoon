import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { colors } from '../../theme';
import type { OrderStatus } from '../../types/order';

const LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
  packed: 'Packed',
  out_for_delivery: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const TONES: Record<OrderStatus, { background: string; color: string }> = {
  placed: { background: 'rgba(82, 183, 136, 0.14)', color: colors.greenMid },
  packed: { background: 'rgba(82, 183, 136, 0.14)', color: colors.greenMid },
  out_for_delivery: { background: colors.goldBg, color: colors.goldDark },
  delivered: { background: 'rgba(82, 183, 136, 0.14)', color: colors.greenMid },
  cancelled: { background: 'rgba(192, 57, 43, 0.12)', color: colors.danger },
};

export function statusLabel(status: OrderStatus): string {
  return LABELS[status];
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone = TONES[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.background }]}>
      <AppText variant="micro" style={{ color: tone.color }}>
        {LABELS[status]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
});
