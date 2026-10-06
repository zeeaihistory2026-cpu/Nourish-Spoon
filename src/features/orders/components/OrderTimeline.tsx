import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors } from '../../../theme';
import type { OrderStatus } from '../../../types/order';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'placed', label: 'Placed' },
  { status: 'packed', label: 'Packed' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
];

const ORDER_INDEX: Record<OrderStatus, number> = {
  placed: 0,
  packed: 1,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: -1,
};

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = ORDER_INDEX[status];

  return (
    <View style={styles.timeline}>
      <View style={styles.line} />
      {STEPS.map((step, index) => {
        const done = status !== 'cancelled' && index <= currentIndex;
        return (
          <View key={step.status} style={styles.step}>
            <View style={[styles.circle, done && styles.circleDone]}>
              {done ? <Check size={12} color={colors.white} strokeWidth={3} /> : null}
            </View>
            <AppText
              variant="micro"
              style={{ color: done ? colors.greenMid : colors.textLight, textAlign: 'center' }}
            >
              {step.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%',
  },
  line: {
    position: 'absolute',
    top: 11,
    left: '12%',
    right: '12%',
    height: 2,
    backgroundColor: colors.borderSoft,
  },
  step: {
    width: '25%',
    alignItems: 'center',
    gap: 7,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: colors.greenMid,
    borderColor: colors.greenMid,
  },
});
