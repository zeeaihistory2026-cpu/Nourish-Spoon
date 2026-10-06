import { Eye, EyeOff } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { colors, radius, shadows } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: ReactNode;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  icon,
  error,
  containerStyle,
  secureTextEntry,
  style,
  ...rest
}: InputProps) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const hasError = Boolean(error);

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="label" color="greenMid" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.field,
          hasError && { borderColor: colors.danger, borderWidth: 1.5 },
        ]}
      >
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={colors.placeholder}
          style={[styles.input, style]}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}
          >
            {hidden ? (
              <Eye size={19} color={colors.textLight} strokeWidth={1.9} />
            ) : (
              <EyeOff size={19} color={colors.goldDark} strokeWidth={1.9} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="small" color="danger" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 54,
    paddingHorizontal: 15,
    ...shadows.sm,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: colors.text,
    padding: 0,
  },
  error: {
    marginTop: 6,
  },
});
