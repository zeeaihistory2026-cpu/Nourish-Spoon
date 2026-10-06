import { Leaf } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

// Soft watercolor-style leaf sprigs in the top corners, as in the reference designs.
export function DecorativeLeaves() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Leaf
        size={96}
        color="rgba(140, 175, 110, 0.28)"
        strokeWidth={1.2}
        style={[styles.leaf, styles.left]}
      />
      <Leaf
        size={110}
        color="rgba(140, 175, 110, 0.24)"
        strokeWidth={1.2}
        style={[styles.leaf, styles.right]}
      />
      <Leaf
        size={64}
        color="rgba(140, 175, 110, 0.2)"
        strokeWidth={1.2}
        style={[styles.leaf, styles.leftSmall]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  leaf: {
    position: 'absolute',
  },
  left: {
    top: -18,
    left: -22,
    transform: [{ rotate: '24deg' }],
  },
  right: {
    top: -26,
    right: -26,
    transform: [{ rotate: '148deg' }],
  },
  leftSmall: {
    top: 66,
    left: -12,
    transform: [{ rotate: '64deg' }],
  },
});
