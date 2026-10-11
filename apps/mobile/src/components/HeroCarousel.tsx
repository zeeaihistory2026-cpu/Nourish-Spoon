import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, AppState, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMobileStore } from "../services/storeService";

const banners = [
  require("../../assets/website/banner-1.png"),
  require("../../assets/website/banner-2.jpg"),
  require("../../assets/website/banner-4.png"),
  require("../../assets/website/banner-5.png"),
  require("../../assets/website/banner-6.png"),
  require("../../assets/website/banner-7.png"),
];

export function HeroCarousel() {
  const { theme } = useMobileStore();
  const pager = useRef<ScrollView>(null);
  const current = useRef(0);
  const lastInteraction = useRef(0);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState !== "background" && AppState.currentState !== "inactive");
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const motion = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    const app = AppState.addEventListener("change", state => setForeground(state === "active"));
    return () => { motion.remove(); app.remove(); };
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
      if (Date.now() - lastInteraction.current > 10000) goTo(current.current + 1, false);
    }, 5000);
    return () => clearInterval(timer);
  }, [width, reduceMotion, foreground]);
  return (
    <View accessibilityLabel="Promotional banners" onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <View style={{ height: width / 2.5, overflow: "hidden" }}>
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => { lastInteraction.current = Date.now(); }}
          scrollEventThrottle={32}
          onScroll={e => {
            if (!width) return;
            const next = Math.max(0, Math.min(banners.length - 1, Math.round(e.nativeEvent.contentOffset.x / width)));
            current.current = next;
            setIndex(next);
          }}
        >
          {banners.map((source, i) => <Image key={i} source={source} accessibilityLabel={`Nourish Spoon banner ${i + 1}`} style={{ width, height: width / 2.5 }} resizeMode="cover" />)}
        </ScrollView>
        {([-1, 1] as const).map(direction => (
          <TouchableOpacity
            key={direction}
            accessibilityRole="button"
            accessibilityLabel={direction < 0 ? "Previous banner" : "Next banner"}
            onPress={() => goTo(current.current + direction)}
            style={[s.arrow, direction < 0 ? { left: 6 } : { right: 6 }]}
          >
            <Ionicons name={direction < 0 ? "chevron-back" : "chevron-forward"} size={19} color="#fff" />
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.dots}>
        {banners.map((_, i) => (
          <TouchableOpacity key={i} accessibilityRole="button" accessibilityLabel={`Go to banner ${i + 1}`} accessibilityState={{ selected: index === i }} style={s.dotTarget} onPress={() => goTo(i)}>
            <View style={{ width: index === i ? 18 : 7, height: 7, borderRadius: 4, backgroundColor: index === i ? theme.gold : theme.border }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  arrow: { position: "absolute", top: "50%", marginTop: -22, width: 44, height: 44, borderRadius: 22, backgroundColor: "#1B433270", borderWidth: 1, borderColor: "#FFFFFF80", alignItems: "center", justifyContent: "center" },
  dots: { flexDirection: "row", justifyContent: "center" },
  dotTarget: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
});
