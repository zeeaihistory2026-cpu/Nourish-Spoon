import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { colors } from '../../theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function Checkbox({ checked, onToggle, children }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={typeof children === 'string' ? children : 'checkbox'}
      onPress={onToggle}
      style={styles.row}
      hitSlop={4}
    >
      <View style={[styles.box, checked && styles.boxOn]}>
        {checked ? <Check size={11} color={colors.white} strokeWidth={3.4} /> : null}
      </View>
      {children ? <AppText variant="small" color="textMid">{children}</AppText> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  box: {
    width: 19,
    height: 19,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.checkbox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    backgroundColor: colors.greenMid,
    borderColor: colors.greenMid,
  },
});
