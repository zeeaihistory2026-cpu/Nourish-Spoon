import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";
import { useReducedMotion } from "./useReducedMotion";
export function useFieldShake(error?: string, validationTick?: number) {
  const offset = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    offset.setValue(0);
    if (!error || reduceMotion) return;
    const motion = Animated.sequence(
      [-4, 4, -3, 3, 0].map((toValue) =>
        Animated.timing(offset, {
          toValue,
          duration: 45,
          useNativeDriver: Platform.OS !== "web",
        }),
      ),
    );
    motion.start();
    return () => {
      motion.stop();
      offset.setValue(0);
    };
  }, [error, validationTick, reduceMotion, offset]);
  return offset;
}
