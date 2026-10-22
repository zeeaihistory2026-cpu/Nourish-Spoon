import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMobileStore } from "../services/storeService";
import { Text, GreenButton } from "./DesignPrimitives";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  action: string;
  onAction: () => void;
};
export function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
}: Props) {
  const theme = useMobileStore((state) => state.theme);
  return (
    <View
      style={[
        s.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={[s.icon, { backgroundColor: theme.surfaceWarm }]}>
        <Ionicons name={icon} size={30} color={theme.primary} />
      </View>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      <Text style={[s.description, { color: theme.textSecondary }]}>
        {description}
      </Text>
      <GreenButton
        title={action}
        onPress={onAction}
        style={{ alignSelf: "stretch" }}
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
    borderRadius: 18,
    gap: 14,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "serif",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  description: { fontSize: 14, lineHeight: 22, textAlign: "center" },
});
