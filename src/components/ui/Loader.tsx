import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, shadows } from '../../theme';

export function Loader() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.gold} />
    </View>
  );
}

function SkeletonBox({ width, height, radius: corner = 8 }: { width: number | `${number}%`; height: number; radius?: number }) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: corner,
        backgroundColor: colors.imageBg,
      }}
    />
  );
}

function ProductCardSkeleton({ width = '100%' }: { width?: number | `${number}%` }) {
  return (
    <View style={[styles.card, { width }]}>
      <SkeletonBox width="100%" height={86} radius={0} />
      <View style={styles.cardBody}>
        <SkeletonBox width="80%" height={12} />
        <SkeletonBox width="55%" height={10} />
        <View style={styles.cardFooter}>
          <SkeletonBox width={56} height={14} />
          <SkeletonBox width={30} height={30} radius={10} />
        </View>
      </View>
    </View>
  );
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardBody: {
    padding: 10,
    gap: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
