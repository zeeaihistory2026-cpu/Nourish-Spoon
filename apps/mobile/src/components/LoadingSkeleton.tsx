import { useEffect, useRef, type ReactNode } from "react";
import {
  Animated,
  Easing,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMobileStore } from "../services/storeService";

/** One native animation is shared by all placeholders and stops on unmount. */
export function SkeletonPulse({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => {
      animation.stop();
      opacity.setValue(1);
    };
  }, [opacity, reducedMotion]);
  return (
    <Animated.View
      style={[style, { opacity }]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Animated.View>
  );
}

export function SkeletonBlock({ style }: { style?: StyleProp<ViewStyle> }) {
  const dark = useMobileStore((state) => state.theme.isDark);
  return (
    <View
      style={[
        { backgroundColor: dark ? "#34483D" : "#E9E0CE", borderRadius: 7 },
        style,
      ]}
    />
  );
}

export function ProductSkeletons() {
  const theme = useMobileStore((state) => state.theme);
  return (
    <SkeletonPulse style={{ flexDirection: "row", gap: 12 }}>
      {[0, 1].map((key) => (
        <View
          key={key}
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: theme.card,
            borderRadius: 20,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.borderSubtle,
          }}
        >
          <SkeletonBlock
            style={{ width: "100%", aspectRatio: 1.12, borderRadius: 0 }}
          />
          <View style={{ padding: 12, gap: 9 }}>
            <SkeletonBlock style={{ height: 17, width: "90%" }} />
            <SkeletonBlock style={{ height: 17, width: "65%" }} />
            <SkeletonBlock style={{ height: 21, width: "57%", marginTop: 4 }} />
            <SkeletonBlock style={{ height: 11, width: "32%" }} />
            <SkeletonBlock
              style={{ height: 34, marginTop: 5, borderRadius: 17 }}
            />
          </View>
        </View>
      ))}
    </SkeletonPulse>
  );
}
