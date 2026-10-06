import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { FONT_FAMILY, colors } from '../../theme';
import { formatPrice } from '../../utils/currency';

interface SumCardProps {
  subtotal: number;
  deliveryFee: number;
}

export function SumCard({ subtotal, deliveryFee }: SumCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText variant="caption" color="textMid">
          Subtotal
        </AppText>
        <AppText variant="caption" color="textMid">
          {formatPrice(subtotal)}
        </AppText>
      </View>
      <View style={styles.row}>
        <AppText variant="caption" color="textMid">
          Delivery
        </AppText>
        {deliveryFee === 0 ? (
          <AppText variant="captionMedium" color="greenMid">
            FREE
          </AppText>
        ) : (
          <AppText variant="caption" color="textMid">
            {formatPrice(deliveryFee)}
          </AppText>
        )}
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <AppText variant="bodySemibold" color="greenDark" style={styles.totalLabel}>
          Total
        </AppText>
        <AppText variant="bodySemibold" color="greenDark" style={styles.totalLabel}>
          {formatPrice(subtotal + deliveryFee)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalRow: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: colors.borderSoft,
    marginTop: 8,
    paddingTop: 11,
  },
  totalLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.body.semibold,
  },
});
