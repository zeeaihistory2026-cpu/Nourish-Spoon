import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
export function useReducedMotion(enabled = true) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    if (!enabled) return;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduced)
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => listener.remove();
  }, [enabled]);
  return reduced;
}
