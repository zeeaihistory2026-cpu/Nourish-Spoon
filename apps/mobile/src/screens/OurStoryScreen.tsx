import React from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { Text, ART, Botanical } from "../components/DesignPrimitives";
import { useStore } from "../services/storeService";
const steps = [
  [
    "leaf",
    "Source Premium Ingredients",
    "We carefully select the finest nuts, dates and natural ingredients.",
  ],
  [
    "bowl-mix-outline",
    "Prepare Fresh",
    "Our traditional family recipes are prepared in small batches for the best taste.",
  ],
  [
    "jar-outline",
    "Pack Airtight",
    "Hygienically packed to lock in freshness and natural nutrition.",
  ],
  [
    "truck-outline",
    "Deliver to You",
    "Freshly made and delivered direct to your doorstep across Pakistan.",
  ],
];
const values = [
  [
    "shield-check-outline",
    "Quality First",
    "Only the best ingredients make it to our jars.",
  ],
  [
    "sprout-outline",
    "Honest Nutrition",
    "Real ingredients. No shortcuts. No refined sugar.",
  ],
  [
    "heart-outline",
    "Made with Love",
    "Crafted with care, just like our family recipes.",
  ],
  ["leaf", "Natural Always", "100% natural, wholesome ingredients."],
  [
    "account-group-outline",
    "Transparent",
    "We believe in honesty, from our kitchen to your home.",
  ],
];
export function OurStoryScreen({ navigation }: { navigation: any }) {
  const { currentTheme: c } = useStore();
  const { width } = useWindowDimensions();
  const grid = (items: string[][]) => (
    <View style={s.grid}>
      {items.map(([icon, title, description]) => (
        <View
          key={title}
          style={[
            s.tile,
            { width: width < 360 ? "48%" : items.length === 4 ? "23%" : "31%" },
          ]}
        >
          <View style={[s.circle, { backgroundColor: c.goldWarm }]}>
            <MaterialCommunityIcons
              name={icon as any}
              size={32}
              color={title === "Made with Love" ? "#D5264D" : c.primary}
            />
          </View>
          <Text style={[s.tileTitle, { color: c.text }]}>{title}</Text>
          <Text style={[s.tileText, { color: c.textSecondary }]}>
            {description}
          </Text>
        </View>
      ))}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Header
        title="Our Story"
        showBack
        onBack={navigation.goBack}
        rightAction="none"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Image
          source={ART.founder}
          accessibilityLabel="Tayyaba preparing ingredients: We make every jar as if it’s going to our own family."
          style={{ width: "100%", aspectRatio: 1.67 }}
          resizeMode="contain"
        />
        <View style={s.narrative}>
          <Botanical />
          <Text style={[s.heading, { color: c.text }]}>
            A Story of Family, Food & Purpose
          </Text>
          <Text style={[s.body, { color: c.textSecondary }]}>
            Nourish Spoon was born from recipes passed down from my mother and
            grandmother — timeless traditions made with real, natural
            ingredients. What started in our home kitchen in Sargodha has grown
            into a mission to share the same warmth, nourishment and goodness
            with families across Pakistan. Every jar carries a piece of our
            family’s love, crafted for yours.
          </Text>
        </View>
        <View style={[s.section, { backgroundColor: c.surfaceWarm }]}>
          <Text style={[s.heading, { color: c.text, textAlign: "center" }]}>
            How We Make It
          </Text>
          {grid(steps)}
        </View>
        <View style={[s.section, { backgroundColor: c.surfaceWarm }]}>
          <Text style={[s.heading, { color: c.text, textAlign: "center" }]}>
            Our Values
          </Text>
          {grid(values)}
        </View>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  narrative: { padding: 20 },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 10,
  },
  body: { fontSize: 14, lineHeight: 22 },
  section: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 6,
  },
  tile: { alignItems: "center", paddingVertical: 8, minWidth: 0 },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  tileTitle: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    marginBottom: 7,
  },
  tileText: { fontSize: 11, lineHeight: 16, textAlign: "center" },
});
