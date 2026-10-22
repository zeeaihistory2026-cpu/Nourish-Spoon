import { useEffect, useRef, useState } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";
import { BUTTON_COLORS, BUTTON_OUTLINE } from "../constants/theme";

const scenes = [
  {
    image: require("../../assets/hero/panjeeri-v2.png"),
    label: "Homemade Panjeeri",
    heading: "Traditional",
    accent: "Panjeeri",
    subtitle: "Pure ingredients.\nReal nutrition.",
    category: "panjeeri",
  },
  {
    image: require("../../assets/hero/energy-balls-v2.png"),
    label: "Date-nut energy balls and wholesome ingredients",
    heading: "Date & Nuts",
    accent: "Energy Balls",
    subtitle: "Natural energy.\nHandcrafted with love.",
    category: "energy_balls",
  },
  {
    image: require("../../assets/hero/ingredients-v2.png"),
    label: "Wholesome nuts and dates",
    heading: "Wholesome",
    accent: "Ingredients",
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
    width < 350 ? "rgba(251,246,237,0.65)" : "rgba(251,246,237,0.3)",
    width < 350 ? "rgba(251,246,237,0.55)" : "rgba(251,246,237,0.12)",
    "rgba(251,246,237,0)",
  ];
  return (
    <View style={s.container}>
      <View
        accessibilityLabel="Home hero"
        style={[
          s.hero,
          {
            minHeight: Math.max(220, width * 0.61) * Math.max(1, fontScale),
            backgroundColor: theme.background,
          },
        ]}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {scenes.map((scene, i) => (
            <Image
              key={scene.label}
              source={scene.image}
              resizeMode="cover"
              accessibilityElementsHidden
              importantForAccessibility="no"
              onLoadEnd={() =>
                setLoaded((current) =>
                  current[i]
                    ? current
                    : current.map((value, j) => (j === i ? true : value)),
                )
              }
              style={[s.heroImage, { opacity: i === index ? 1 : 0 }]}
            />
          ))}
        </View>
        <LinearGradient
          colors={gradient}
          locations={width < 350 ? [0, 0.43, 0.68] : [0, 0.3, 0.55]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.copy}>
          <Text
            style={[
              s.heading,
              {
                color: "#103B32",
                fontSize: width < 350 ? 26 : 30,
                lineHeight: width < 350 ? 35 : 40,
              },
            ]}
          >
            {scenes[index].heading}
            {"\n"}
            <Text
              style={[
                s.heading,
                {
                  color: "#A96819",
                  fontSize: width < 350 ? 26 : 30,
                  lineHeight: width < 350 ? 35 : 40,
                },
              ]}
            >
              {scenes[index].accent}
            </Text>
          </Text>
          <Text
            style={[
              s.subtitle,
              { color: "#193E35", minHeight: Math.ceil(36 * fontScale) },
            ]}
          >
            {scenes[index].subtitle}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Shop Now"
            onPress={() => onShop(scenes[index].category)}
            style={[s.shop, { width: width < 350 ? 100 : 112 }]}
          >
            <Text
              style={{
                color: BUTTON_COLORS.text,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              Shop Now
            </Text>
            <Ionicons name="arrow-forward" size={17} color="#fff" />
          </TouchableOpacity>
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
                  width: i === index ? 18 : 16,
                  height: 6,
                  borderRadius: 4,
                  backgroundColor:
                    i === index ? BUTTON_COLORS.background : "#D8CEBB",
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  container: { marginBottom: 0 },
  hero: { overflow: "hidden", paddingBottom: 14 },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  copy: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "flex-start",
  },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 40,
    lineHeight: 43,
    includeFontPadding: true,
    paddingBottom: 8,
    flexShrink: 0,
  },
  subtitle: { fontSize: 12, lineHeight: 18, marginTop: 8, width: "52%" },
  shop: {
    marginTop: 10,
    backgroundColor: BUTTON_COLORS.background,
    ...BUTTON_OUTLINE,
    borderRadius: 26,
    minHeight: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dots: { marginLeft: 20, marginTop: 14, flexDirection: "row" },
  dotTarget: {
    width: 32,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
