import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { TEXT_STYLES, colors, type AppColor, type TextVariant } from '../../theme';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: AppColor | (string & {});
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: AppTextProps) {
  const resolvedColor = color
    ? (colors as Record<string, string>)[color as AppColor] ?? color
    : undefined;

  return (
    <Text {...rest} style={[TEXT_STYLES[variant], resolvedColor ? { color: resolvedColor } : null, style]}>
      {children}
    </Text>
  );
}
