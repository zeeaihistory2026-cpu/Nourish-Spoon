import { StyleSheet, View } from 'react-native';

import { Stars } from '../ui/Stars';
import { AppText } from '../ui/AppText';
import { ratingSummary } from '../../utils/reviewMath';
import { colors } from '../../theme';
import type { Review } from '../../types/review';

export { ratingSummary };

interface RatingSummaryProps {
  average: number;
  count: number;
  distribution?: Record<number, number>;
}

export function RatingSummary({ average, count, distribution }: RatingSummaryProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <AppText variant="ratingBig" color="greenDark">
          {average > 0 ? average.toFixed(1) : '—'}
        </AppText>
        <View style={styles.stars}>
          <Stars rating={average} size={12} />
        </View>
        <AppText variant="microRegular" color="textLight">
          {count} review{count === 1 ? '' : 's'}
        </AppText>
      </View>
      <View style={styles.bars}>
        {[5, 4, 3, 2, 1].map((stars) => {
          const bucket = distribution?.[stars] ?? 0;
          const percent = count > 0 ? Math.round((bucket / count) * 100) : 0;
          return (
            <View key={stars} style={styles.bar}>
              <AppText variant="microRegular" color="textLight">
                {stars}
              </AppText>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
  },
  left: {
    alignItems: 'center',
  },
  stars: {
    marginTop: 5,
  },
  bars: {
    flex: 1,
    gap: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.trackBg,
    overflow: 'hidden',
  },
  fill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
});
