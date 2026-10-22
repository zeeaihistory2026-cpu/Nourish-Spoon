import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Header } from "../components/Header";
import { Text, ART, Botanical } from "../components/DesignPrimitives";
import { useMobileStore } from "../services/storeService";
import { AppNavigation } from "../navigation/types";
import { FOUNDER_STORY } from "@packages/catalog/websiteSnapshot";
const processIcons = [
  "leaf",
  "bowl-mix-outline",
  "bottle-tonic-outline",
  "truck-outline",
] as const;
const valueIcons = [
  "shield-check-outline",
  "sprout-outline",
  "heart-outline",
  "leaf",
  "account-group-outline",
] as const;
const steps = FOUNDER_STORY.process.map((step, index) => [
  processIcons[index] || "leaf",
  step.title,
  step.desc,
]);
const values = FOUNDER_STORY.values.map((value, index) => [
  valueIcons[index] || "leaf",
  value.title,
  value.desc,
]);
export function OurStoryScreen({ navigation }: { navigation: AppNavigation }) {
  const { theme: c } = useMobileStore();
  const { width, fontScale } = useWindowDimensions();
  const founderImageHeight = width / 1.67;
  const founderHeight = Math.max(
    founderImageHeight,
    Math.ceil(190 * fontScale),
  );
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
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View
          style={[
            s.founderHero,
            { minHeight: founderHeight, backgroundColor: c.surfaceWarm },
          ]}
        >
          <View style={s.founderPhoto}>
            <Image
              source={ART.founder}
              accessibilityLabel={`${FOUNDER_STORY.founder_name} preparing ingredients`}
              style={{
                width: "100%",
                height: founderImageHeight,
              }}
              resizeMode="cover"
            />
          </View>
          <View
            style={[
              s.founderCard,
              {
                backgroundColor: c.isDark ? c.surface : "#FFF8E2",
                borderColor: c.goldWarm,
                top: width * 0.045,
                minHeight: Math.max(156, founderImageHeight * 0.74),
              },
            ]}
          >
            <MaterialCommunityIcons
              name="format-quote-open"
              size={18}
              color={c.gold}
            />
            <Text style={[s.founderQuote, { color: c.text }]}>
              {FOUNDER_STORY.quote}
            </Text>
            <View style={[s.quoteDivider, { backgroundColor: c.gold }]} />
            <Text style={[s.founderName, { color: c.text }]}>
              {FOUNDER_STORY.founder_name}
            </Text>
            <Text style={[s.founderDetail, { color: c.textSecondary }]}>
              {FOUNDER_STORY.title}
            </Text>
            <Text style={[s.founderDetail, { color: c.textSecondary }]}>
              {FOUNDER_STORY.location}
            </Text>
          </View>
        </View>
        <View style={s.narrative}>
          <Botanical />
          <Text style={[s.heading, { color: c.text }]}>
            {FOUNDER_STORY.story_heading}
          </Text>
          <Text style={[s.body, { color: c.textSecondary }]}>
            {FOUNDER_STORY.story_body}
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
  founderHero: {
    overflow: "hidden",
  },
  founderPhoto: {
    width: "100%",
  },
  founderCard: {
    position: "absolute",
    right: 0,
    width: "49%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    shadowColor: "#4D351B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  founderQuote: {
    fontFamily: "serif",
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 18,
  },
  quoteDivider: { width: 28, height: 1, marginVertical: 8 },
  founderName: {
    fontFamily: "serif",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    marginBottom: 3,
  },
  founderDetail: { fontSize: 10, lineHeight: 14 },
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
