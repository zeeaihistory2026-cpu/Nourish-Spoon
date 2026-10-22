import {
  Text as NativeText,
  TextProps,
  StyleSheet,
  View,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useMobileStore } from "../services/storeService";
import { Product } from "@packages/types";
import {
  BUTTON_COLORS,
  BUTTON_OUTLINE,
  WHATSAPP_BUTTON_COLORS,
} from "../constants/theme";

export function Text({ style, ...props }: TextProps) {
  const defaultColor = useMobileStore((state) => state.theme.text);
  const flat = StyleSheet.flatten(style) || {};
  const serif = flat.fontFamily === "serif";
  const bold = Number(flat.fontWeight) >= 600 || flat.fontWeight === "bold";
  const fontFamily = serif
    ? flat.fontStyle === "italic"
      ? "CormorantGaramond_400Regular_Italic"
      : bold
        ? "CormorantGaramond_700Bold"
        : "CormorantGaramond_400Regular"
    : flat.fontWeight === "bold" || Number(flat.fontWeight) >= 700
      ? "Jost_700Bold"
      : Number(flat.fontWeight) >= 600
        ? "Jost_600SemiBold"
        : Number(flat.fontWeight) >= 500
          ? "Jost_500Medium"
          : "Jost_400Regular";
  return (
    <NativeText
      {...props}
      style={[
        { color: defaultColor },
        style,
        { fontFamily, fontWeight: "normal" },
      ]}
    />
  );
}

/** Matches the website's product detail price: Jost, 16px, bold. */
export function PriceText({ style, ...props }: TextProps) {
  const color = useMobileStore((state) => state.theme.gold);
  return (
    <Text
      {...props}
      style={[
        { color },
        style,
        {
          fontFamily: "Jost_700Bold",
          fontSize: 16,
          lineHeight: 22,
          fontWeight: "700",
          fontStyle: "normal",
        },
      ]}
    />
  );
}

export const ART = {
  brand: require("../../assets/website/logo-transparent.png"),
  botanical: require("../../assets/design/botanical.png"),
  onboarding: require("../../assets/design/onboarding-food.jpg"),
  founder: require("../../assets/design/founder.jpg"),
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

export function Brand({
  large = false,
  website = false,
  textColor,
}: {
  large?: boolean;
  website?: boolean;
  textColor?: string;
}) {
  const { theme } = useMobileStore();
  if (website)
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          flexShrink: 1,
        }}
      >
        <Image
          source={require("../../assets/website/logo-transparent.png")}
          resizeMode="contain"
          style={{
            width: large ? 46 : 38,
            height: large ? 46 : 38,
            tintColor: "#BE8A28",
          }}
        />
        <View style={{ flexShrink: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={{
              fontFamily: "serif",
              fontSize: large ? 24 : 22,
              lineHeight: large ? 28 : 25,
              fontWeight: "700",
              color: textColor || theme.text,
            }}
          >
            Nourish Spoon™
          </Text>
          <Text style={{ fontSize: large ? 11 : 12, color: theme.gold }}>
            Crafted with Love
          </Text>
        </View>
      </View>
    );
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={ART.brand}
        resizeMode="contain"
        style={{
          width: large ? 80 : 46,
          height: large ? 80 : 46,
          tintColor: "#C9A84C",
        }}
      />
      <Text
        style={{
          fontFamily: "serif",
          fontSize: large ? 36 : 24,
          fontWeight: "700",
          color: theme.text,
          marginTop: 7,
        }}
      >
        Nourish Spoon™
      </Text>
      <Text
        style={{
          fontFamily: "serif",
          fontSize: large ? 18 : 14,
          color: theme.gold,
        }}
      >
        Crafted with Love
      </Text>
    </View>
  );
}

interface GreenButtonProps {
  title: string;
  onPress: () => void;
  whatsapp?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
export function GreenButton({
  title,
  onPress,
  whatsapp = false,
  disabled = false,
  style,
}: GreenButtonProps) {
  const colors = whatsapp ? WHATSAPP_BUTTON_COLORS : BUTTON_COLORS;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        {
          borderRadius: 16,
          ...BUTTON_OUTLINE,
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: colors.background,
          minHeight: 47,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 14,
          gap: 9,
        }}
      >
        {whatsapp && (
          <FontAwesome name="whatsapp" size={25} color={colors.text} />
        )}
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: "700",
            flexShrink: 1,
            textAlign: "center",
            paddingVertical: 10,
          }}
        >
          {title}
        </Text>
        <Ionicons name="arrow-forward" size={23} color={colors.text} />
      </View>
    </TouchableOpacity>
  );
}

export function Rating({
  product,
  compact = false,
  verified = false,
}: {
  product: Pick<Product, "rating" | "review_count">;
  compact?: boolean;
  verified?: boolean;
}) {
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
            name={i < Math.round(product.rating) ? "star" : "star-outline"}
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
