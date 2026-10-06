import { Pressable, StyleSheet, View } from 'react-native';

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export function Toggle({ value, onToggle }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onToggle}
      style={[styles.track, value && styles.trackOn]}
      hitSlop={8}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 42,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#E2D8BC',
    padding: 2.5,
  },
  trackOn: {
    backgroundColor: '#2D6A4F',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  knobOn: {
    transform: [{ translateX: 17 }],
  },
});
