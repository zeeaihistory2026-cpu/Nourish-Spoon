import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import { useMobileStore } from "../services/storeService";

const banners = [
  require("../../assets/website/banner-1.png"),
  require("../../assets/website/banner-2.jpg"),
  require("../../assets/website/banner-4.png"),
  require("../../assets/website/banner-5.png"),
  require("../../assets/website/banner-6.png"),
  require("../../assets/website/banner-7.png"),
];
const ratios = banners.map((source) => {
  const asset = Asset.fromModule(source);
  return asset.width && asset.height ? asset.width / asset.height : 2.5;
});

export function HeroCarousel() {
  const { theme } = useMobileStore();
  const pager = useRef<ScrollView>(null);
  const current = useRef(0);
  const lastInteraction = useRef(0);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const height = width / ratios[index];
  const [reduceMotion, setReduceMotion] = useState(true);
  const [foreground, setForeground] = useState(
    AppState.currentState !== "background" &&
      AppState.currentState !== "inactive",
  );
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
  const goTo = (next: number, manual = true) => {
    const target = (next + banners.length) % banners.length;
    if (manual) lastInteraction.current = Date.now();
    current.current = target;
    setIndex(target);
    pager.current?.scrollTo({ x: width * target, animated: !reduceMotion });
  };
  useEffect(() => {
    pager.current?.scrollTo({ x: width * current.current, animated: false });
    if (!width || reduceMotion || !foreground) return;
    const timer = setInterval(() => {
      if (Date.now() - lastInteraction.current > 10000)
        goTo(current.current + 1, false);
    }, 5000);
    return () => clearInterval(timer);
  }, [width, reduceMotion, foreground]);
  return (
    <View
      accessibilityLabel="Promotional banners"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View style={{ height, overflow: "hidden" }}>
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => {
            lastInteraction.current = Date.now();
          }}
          scrollEventThrottle={32}
          onScroll={(e) => {
            if (!width) return;
            const next = Math.max(
              0,
              Math.min(
                banners.length - 1,
                Math.round(e.nativeEvent.contentOffset.x / width),
              ),
            );
            current.current = next;
            setIndex(next);
          }}
        >
          {banners.map((source, i) => (
            <Image
              key={i}
              source={source}
              accessibilityLabel={`Nourish Spoon banner ${i + 1}`}
              style={{ width, height }}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </View>
      <View style={s.dots}>
        {banners.map((_, i) => (
          <TouchableOpacity
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Go to banner ${i + 1}`}
            accessibilityState={{ selected: index === i }}
            style={s.dotTarget}
            onPress={() => goTo(i)}
          >
            <View
              style={{
                width: index === i ? 18 : 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: index === i ? theme.gold : theme.border,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dots: { flexDirection: "row", justifyContent: "center" },
  dotTarget: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
