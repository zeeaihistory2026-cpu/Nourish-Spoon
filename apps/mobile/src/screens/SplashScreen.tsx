import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "../components/DesignPrimitives";

export function SplashScreen({ onFinish, onReady }: { onFinish: () => void; onReady?: () => void }) {
  const [laidOut, setLaidOut] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [width, setWidth] = useState(0);
  const visible = laidOut && photoReady && logoReady;
  useEffect(() => { if (visible) onReady?.(); }, [visible, onReady]);
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish, visible]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FDF6E3",
        alignItems: "center",
      }}
      onLayout={(event) => { setWidth(event.nativeEvent.layout.width); setLaidOut(true); }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Image source={require("../../assets/website/logo-transparent.png")} style={s.logo} resizeMode="contain" onLoadEnd={() => setLogoReady(true)} />
        <Text style={s.brand}>Nourish Spoon™</Text>
        <Text style={s.tagline}>Crafted with Love</Text>
        <Text
          style={{
            fontFamily: "serif",
            fontSize: 18,
            textAlign: "center",
            color: "#1B4332",
            marginTop: 28,
          }}
        >
          Wholesome Nutrition{"\n"}for Healthier Tomorrows
        </Text>
        <Text style={s.products}>Homemade Panjeeri & Date-Nut Laddus</Text>
      </View>
      <Image
        source={require("../../assets/website/banner-1.png")}
        accessibilityLabel="Homemade Panjeeri and date-nut laddus"
        style={{ width: "100%", height: width * 576 / 1440, flexShrink: 0 }}
        resizeMode="contain"
        onLoadEnd={() => setPhotoReady(true)}
      />
      <Text
        style={{
          fontFamily: "serif",
          color: "#1B4332",
          fontSize: 11,
          paddingVertical: 20,
        }}
      >
        100% Natural | Handmade | Pakistani Goodness
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  logo: { width: 88, height: 88, marginBottom: 12, tintColor: '#C9A84C' },
  brand: { fontFamily: "serif", fontWeight: "700", fontSize: 32, color: "#1B4332", textAlign: "center" },
  tagline: { fontFamily: "serif", fontSize: 18, color: "#C9A84C", marginTop: 4 },
  products: { fontSize: 13, color: "#1B4332", textAlign: "center", marginTop: 12 },
});
