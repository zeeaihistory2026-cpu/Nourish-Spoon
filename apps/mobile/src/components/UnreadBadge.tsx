import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "./DesignPrimitives";

export function UnreadBadge({
  count,
  dot = false,
  style,
}: {
  count: number;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  if (count < 1) return null;
  return (
    <View pointerEvents="none" style={[styles.badge, dot && styles.dot, style]}>
      {!dot && (
        <Text allowFontScaling={false} style={styles.count}>
          {count > 99 ? "99+" : count}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 17,
    minHeight: 17,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#D83F38",
    borderWidth: 1.5,
    borderColor: "#FFFDF7",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    minWidth: 10,
    height: 10,
    minHeight: 10,
    paddingHorizontal: 0,
  },
  count: { color: "#FFFFFF", fontSize: 10, lineHeight: 13, fontWeight: "700" },
});
