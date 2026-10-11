import React from "react";
import {
  Text as NativeText,
  TextProps,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMobileStore } from "../services/storeService";

export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) || {};
  const serif = flat.fontFamily === "serif";
  const bold = Number(flat.fontWeight) >= 600 || flat.fontWeight === "bold";
  const fontFamily = serif
    ? flat.fontStyle === "italic"
      ? "CormorantGaramond_400Regular_Italic"
      : bold
        ? "CormorantGaramond_700Bold"
        : "CormorantGaramond_400Regular"
    : bold
      ? "Jost_700Bold"
      : "Jost_400Regular";
  return (
    <NativeText
      {...props}
      style={[
        { color: useMobileStore.getState().theme.text },
        style,
        { fontFamily, fontWeight: "normal" },
      ]}
    />
  );
}

export const ART = {
  brand: require("../../assets/website/logo-2.jpg"),
  botanical: require("../../assets/design/botanical.png"),
  home: require("../../assets/design/home-food.jpg"),
  splash: require("../../assets/design/splash-food.jpg"),
  onboarding: require("../../assets/design/onboarding-food.jpg"),
  login: require("../../assets/design/login-food.jpg"),
  contact: require("../../assets/design/contact-food.jpg"),
  founder: require("../../assets/design/founder.jpg"),
  energyCard: require("../../assets/website/product-1-main.png"),
  panjeeriCard: require("../../assets/website/product-2-main.png"),
  energyCatalog: require("../../assets/website/product-1-main.png"),
  panjeeriCatalog: require("../../assets/website/product-2-main.png"),
  energyDetail: require("../../assets/website/product-1-main.png"),
  panjeeriDetail: require("../../assets/website/product-2-main.png"),
  proof: require("../../assets/design/review-proof.png"),
};

export function Botanical({ full = false }: { full?: boolean }) {
  const { theme } = useMobileStore();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={ART.botanical}
        style={{
          position: "absolute",
          left: -35,
          top: 0,
          width: full ? 165 : 140,
          height: full ? 230 : 145,
          opacity: theme.isDark ? 0.1 : 0.6,
          transform: [{ scaleX: -1 }],
        }}
        resizeMode="contain"
      />
      <Image
        source={ART.botanical}
        style={{
          position: "absolute",
          right: -30,
          top: full ? 50 : 0,
          width: full ? 160 : 140,
          height: full ? 230 : 145,
          opacity: theme.isDark ? 0.1 : 0.6,
        }}
        resizeMode="contain"
      />
    </View>
  );
}

export function Brand({ large = false, website = false }: { large?: boolean; website?: boolean }) {
  const { theme } = useMobileStore();
  if (website) return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 7, flexShrink: 1 }}>
      <Image source={require("../../assets/website/logo-2.jpg")} style={{ width: 38, height: 38, borderRadius: 19 }} />
      <View>
        <Text style={{ fontFamily: "serif", fontSize: 22, lineHeight: 25, fontWeight: "700", color: theme.text }}>Nourish Spoon™</Text>
        <Text style={{ fontFamily: "serif", fontSize: 14, color: theme.gold }}>Crafted with Love</Text>
      </View>
    </View>
  );
  return (
    <View style={{ alignItems: "center" }}>
      <Image source={ART.brand} style={{ width: large ? 80 : 46, height: large ? 80 : 46, borderRadius: large ? 40 : 23 }} />
      <Text style={{ fontFamily: "serif", fontSize: large ? 36 : 24, fontWeight: "700", color: theme.text, marginTop: 7 }}>Nourish Spoon™</Text>
      <Text style={{ fontFamily: "serif", fontSize: large ? 18 : 14, color: theme.gold }}>Crafted with Love</Text>
    </View>
  );

}

export function GreenButton({
  title,
  onPress,
  whatsapp = false,
  disabled = false,
  style,
}: any) {
  const { theme } = useMobileStore();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        { borderRadius: 8, overflow: "hidden", opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={whatsapp ? [theme.whatsapp, theme.whatsapp] : ["#1B4332", "#1B4332"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: 47,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 14,
          gap: 9,
        }}
      >
        {whatsapp && <FontAwesome name="whatsapp" size={25} color="#fff" />}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "700",
            flexShrink: 1,
            textAlign: "center",
            paddingVertical: 10,
          }}
        >
          {title}
        </Text>
        <Ionicons name="arrow-forward" size={23} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function Rating({ product, compact = false, verified = false }: any) {
  const { theme } = useMobileStore();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: compact ? 3 : 5,
        marginVertical: 4,
      }}
    >
      <View style={{ flexDirection: "row", gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Ionicons
            key={i}
            name="star"
            color="#F7A500"
            size={compact ? 13 : 19}
          />
        ))}
      </View>
      <Text
        style={{
          fontSize: compact ? 12 : 16,
          color: theme.text,
          fontWeight: "700",
        }}
      >
        {product.rating}
      </Text>
      <Text style={{ fontSize: compact ? 10 : 13, color: theme.textSecondary }}>
        ({product.review_count}
        {verified ? " verified" : ""} reviews)
      </Text>
    </View>
  );
}
