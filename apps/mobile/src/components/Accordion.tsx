import { PropsWithChildren, useState } from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "./AppTouchable";
import { Text } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

export function Accordion({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  const { theme } = useMobileStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        aria-expanded={expanded}
        onPress={() => setExpanded((current) => !current)}
        style={styles.header}
      >
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.primary}
        />
      </TouchableOpacity>
      {expanded && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 16, borderWidth: 1 },
  header: {
    minHeight: 52,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: "serif",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
  },
  body: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
});
