import { UnreadBadge } from "./UnreadBadge";
import { useNotificationInbox } from "../features/commerce/NotificationInbox";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMobileStore } from "../services/storeService";
import { Text, Botanical, Brand } from "./DesignPrimitives";
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onSearch?: () => void;
  onNotifications?: () => void;
  rightAction?: "search" | "notifications" | "none";
  premium?: boolean;
  inverse?: boolean;
}
export function Header({
  title,
  showBack,
  onBack,
  onMenu,
  onSearch,
  onNotifications,
  rightAction = "none",
  premium = false,
  inverse = false,
}: HeaderProps) {
  const { theme } = useMobileStore();
  const { unreadCount } = useNotificationInbox();
  return (
    <View
      style={[
        styles.header,
        { minHeight: title ? 65 : premium ? 82 : 72 },
        premium && !inverse && { backgroundColor: theme.background },
      ]}
    >
      {title && <Botanical />}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={showBack ? "Go back" : "Open menu"}
        onPress={showBack ? onBack : onMenu}
        style={[
          styles.circle,
          { backgroundColor: premium ? theme.surfaceWarm : theme.surface },
          inverse && {
            backgroundColor: "#FFFFFF08",
            borderWidth: 1,
            borderColor: "#FFFFFF40",
          },
        ]}
      >
        <Ionicons
          name={showBack ? "chevron-back" : "menu"}
          size={25}
          color={inverse ? "#FFFDF7" : theme.text}
        />
      </TouchableOpacity>
      {title ? (
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      ) : (
        <Brand
          website
          large={premium}
          textColor={inverse ? "#FFFDF7" : undefined}
          taglineColor={inverse ? "#E7BF65" : undefined}
        />
      )}
      {rightAction === "none" ? (
        <View style={{ width: 44 }} />
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            rightAction === "search"
              ? "Search products"
              : unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
          }
          onPress={rightAction === "search" ? onSearch : onNotifications}
          style={[
            styles.circle,
            { backgroundColor: premium ? theme.surfaceWarm : theme.surface },
          ]}
        >
          <Ionicons
            name={rightAction === "search" ? "search" : "notifications-outline"}
            size={23}
            color={theme.text}
          />
          {rightAction === "notifications" && (
            <UnreadBadge count={unreadCount} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "serif",
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
});
