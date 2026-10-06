import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { colors } from '../../theme';

interface QtyStepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  height?: number;
}

export function QtyStepper({ value, onDecrement, onIncrement, height = 44 }: QtyStepperProps) {
  return (
    <View style={[styles.stepper, { height }]}>
      <Pressable
        onPress={onDecrement}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
      >
        <Minus size={16} color={colors.greenMid} strokeWidth={2.4} />
      </Pressable>
      <AppText variant="bodySemibold" style={styles.value}>
        {value}
      </AppText>
      <Pressable
        onPress={onIncrement}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.6 }]}
      >
        <Plus size={16} color={colors.greenMid} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    width: 42,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    flex: 1,
    textAlign: 'center',
    minWidth: 26,
  },
});
