import React from "react";
import { TouchableOpacity as NativeTouchableOpacity } from "react-native";

/** Keep all app taps immediate, without the native opacity fade. */
export const TouchableOpacity = React.forwardRef<
  React.ComponentRef<typeof NativeTouchableOpacity>,
  React.ComponentProps<typeof NativeTouchableOpacity>
>(function AppTouchable(props, ref) {
  return <NativeTouchableOpacity {...props} ref={ref} activeOpacity={1} />;
});
