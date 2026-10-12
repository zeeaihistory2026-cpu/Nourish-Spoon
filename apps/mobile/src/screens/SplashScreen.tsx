import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";

export function SplashScreen({
  onFinish,
  onReady,
}: {
  onFinish: () => void;
  onReady?: () => void;
}) {
  const [laidOut, setLaidOut] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const visible = laidOut && logoReady;
  useEffect(() => {
    if (visible) onReady?.();
  }, [visible, onReady]);
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onFinish, 1000);
    return () => clearTimeout(timer);
  }, [onFinish, visible]);
  return (
    <View style={s.screen} onLayout={() => setLaidOut(true)}>
      <Image
        source={require("../../assets/website/logo-transparent.png")}
        accessibilityLabel="Nourish Spoon logo"
        style={s.logo}
        resizeMode="contain"
        onLoad={() => setLogoReady(true)}
      />
    </View>
  );
}
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FDF6E3",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 128, height: 128, tintColor: "#C9A84C" },
});
