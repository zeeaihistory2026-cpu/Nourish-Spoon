import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  AppState,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

const scenes = [
  {
    image: require("../../assets/hero/panjeeri.png"),
    label: "Homemade Panjeeri",
    heading: "Traditional\nPanjeeri",
    subtitle: "Pure ingredients.\nReal nutrition.",
    category: "panjeeri",
  },
  {
    image: require("../../assets/hero/energy-balls.png"),
    label: "Date-nut energy balls and wholesome ingredients",
    heading: "Date & Nuts\nEnergy Balls",
    subtitle: "Natural energy.\nHandcrafted with love.",
    category: "energy_balls",
  },
  {
    image: require("../../assets/hero/ingredients.png"),
    label: "Wholesome nuts and dates",
    heading: "Wholesome\nIngredients",
    subtitle: "Premium nuts & dates.\nPure, naturally yours.",
    category: "all",
  },
];

/** Each background shares stable geometry and its own matching copy and shop destination. */
export function HomeHero({ onShop }: { onShop: (category: string) => void }) {
  const { theme } = useMobileStore();
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([false, false, false]);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [foreground, setForeground] = useState(
    AppState.currentState !== "background" &&
      AppState.currentState !== "inactive",
  );
  const lastInteraction = useRef(0);
  const height = Math.max(228, Math.ceil(220 * fontScale));
  const imageHeight = Math.min(height, width / 2);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {});
    const motion = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    const app = AppState.addEventListener("change", (state) =>
      setForeground(state === "active"),
    );
    return () => {
      motion.remove();
      app.remove();
    };
  }, []);
  const ready = loaded.every(Boolean);
  useEffect(() => {
    if (!ready || reduceMotion || !foreground) return;
    const timer = setInterval(() => {
      if (Date.now() - lastInteraction.current > 10000)
        setIndex((current) => (current + 1) % scenes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [ready, reduceMotion, foreground]);
  const gradient: readonly [string, string, string] = [
    "#F5EADB",
    "rgba(245,234,219,0.75)",
    "rgba(245,234,219,0)",
  ];
  return (
    <View>
      <View
        accessibilityLabel="Home hero"
        style={[s.hero, { height, backgroundColor: "#F5EADB" }]}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {scenes.map((scene, i) => (
          <Image
            key={scene.label}
            source={scene.image}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            onLoadEnd={() =>
              setLoaded((current) =>
                current[i]
                  ? current
                  : current.map((value, j) => (j === i ? true : value)),
              )
            }
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width,
              height: imageHeight,
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}
        <LinearGradient
          colors={["#F5EADB", "rgba(245,234,219,0)"]}
          style={{
            position: "absolute",
            top: height - imageHeight - 1,
            left: 0,
            right: 0,
            height: 44,
          }}
          pointerEvents="none"
        />
        <LinearGradient
          colors={gradient}
          locations={[0, 0.2, 0.62]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.copy}>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            style={[
              s.heading,
              {
                color: "#183320",
                fontSize: width < 320 ? 26 : 30,
                height: Math.ceil(60 * fontScale),
              },
            ]}
          >
            {scenes[index].heading}
          </Text>
          <Text
            style={{
              fontFamily: "serif",
              fontWeight: "700",
              fontSize: width < 320 ? 22 : 24,
              lineHeight: 26,
              color: "#805025",
            }}
          >
            from Sargodha
          </Text>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            style={[
              s.subtitle,
              { color: "#46503C", height: Math.ceil(34 * fontScale) },
            ]}
          >
            {scenes[index].subtitle}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Shop Now"
            onPress={() => onShop(scenes[index].category)}
            style={s.shop}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
              Shop Now
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.dots}>
        {scenes.map((scene, i) => (
          <TouchableOpacity
            key={scene.label}
            accessibilityRole="button"
            accessibilityLabel={`Show home image ${i + 1}`}
            accessibilityState={{ selected: index === i }}
            onPress={() => {
              lastInteraction.current = Date.now();
              setIndex(i);
            }}
            style={s.dotTarget}
          >
            <View
              style={{
                width: i === index ? 14 : 6,
                height: 6,
                borderRadius: 4,
                backgroundColor: i === index ? theme.primary : theme.border,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  hero: { marginHorizontal: 12, borderRadius: 16, overflow: "hidden" },
  copy: {
    padding: 16,
    width: "62%",
    flex: 1,
    paddingTop: 18,
    alignItems: "flex-start",
  },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 30,
    lineHeight: 30,
  },
  subtitle: { fontSize: 12, lineHeight: 17, marginTop: 10, marginBottom: 12 },
  shop: {
    position: "absolute",
    left: 16,
    bottom: 16,
    backgroundColor: "#1B4332",
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dots: { flexDirection: "row", justifyContent: "center" },
  dotTarget: {
    width: 32,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
