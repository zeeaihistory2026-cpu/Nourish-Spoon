import { Text } from "./DesignPrimitives";
import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMobileStore } from "../services/storeService";
import { LinearGradient } from "expo-linear-gradient";

interface TrustBadgesProps {
  variant?: "home" | "product";
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  variant = "home",
}) => {
  const { theme } = useMobileStore();

  if (variant === "home")
    return (
      <LinearGradient
        colors={["#456B54", "#153F30", "#3F622E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          borderRadius: 20,
          paddingVertical: 17,
          paddingHorizontal: 8,
        }}
      >
        {[
          {
            title: "100%",
            detail: "Natural ingredients",
            icon: "leaf-outline",
          },
          {
            title: "Handcrafted",
            detail: "Family recipes",
            icon: "heart-outline",
          },
          { title: "Small batch", detail: "Freshness", icon: "flower-outline" },
          {
            title: "No",
            detail: "Preservatives",
            icon: "shield-checkmark-outline",
          },
        ].map((badge, index) => (
          <View
            key={badge.title}
            accessible
            accessibilityLabel={`${badge.title} ${badge.detail}`}
            style={{
              flex: 1,
              minWidth: 0,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingHorizontal: 5,
              borderRightWidth: index < 3 ? 1 : 0,
              borderColor: "#FFFFFF40",
            }}
          >
            <Ionicons
              name={badge.icon as React.ComponentProps<typeof Ionicons>["name"]}
              size={21}
              color="#FFFDF5"
            />
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                style={{ fontSize: 9, lineHeight: 14, color: "#FFFDF5" }}
              >
                {badge.title}
              </Text>
              <Text
                numberOfLines={badge.detail.includes(" ") ? 2 : 1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={{ fontSize: 8, lineHeight: 12, color: "#EAEDE2" }}
              >
                {badge.detail}
              </Text>
            </View>
          </View>
        ))}
      </LinearGradient>
    );

  const badges = [
    { title: "Freshly\nMade", icon: "leaf-outline", lib: "ionicons" },
    {
      title: "Airtight\nPacked",
      icon: "archive-outline",
      lib: "ionicons",
    },
    {
      title: "No\nPreservatives",
      icon: "flask-outline",
      lib: "ionicons",
    },
    { title: "100%\nNatural", icon: "sprout-outline", lib: "material" },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surfaceWarm, borderColor: theme.border },
      ]}
    >
      {badges.map((b, i) => (
        <View key={i} style={styles.badgeItem}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.goldWarm, borderColor: theme.goldWarm },
            ]}
          >
            {b.lib === "material" ? (
              <MaterialCommunityIcons
                name={b.icon as any}
                size={20}
                color={theme.primary}
              />
            ) : (
              <Ionicons name={b.icon as any} size={19} color={theme.primary} />
            )}
          </View>
          <Text style={[styles.badgeTitle, { color: theme.text }]}>
            {b.title}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  badgeItem: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 14,
  },
});
