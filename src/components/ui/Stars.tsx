import { Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

interface StarsProps {
  rating: number;
  size?: number;
  color?: string;
}

export function Stars({ rating, size = 12, color = colors.gold }: StarsProps) {
  const filled = Math.round(rating);
  return (
    <View style={styles.row} accessibilityLabel={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((position) => (
        <Star
          key={position}
          size={size}
          color={color}
          fill={position <= filled ? color : 'transparent'}
          strokeWidth={position <= filled ? 0 : 1.8}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});
