import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduced)
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => listener.remove();
  }, []);
  return reduced;
}
