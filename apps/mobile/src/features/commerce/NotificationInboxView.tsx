import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import type { OrderNotice, Purchase } from "@packages/types/commerce";
import { Header } from "../../components/Header";
import { Text } from "../../components/DesignPrimitives";
import { TouchableOpacity } from "../../components/AppTouchable";
import { SkeletonBlock, SkeletonPulse } from "../../components/LoadingSkeleton";
import { useMobileStore } from "../../services/storeService";
import { BUTTON_COLORS } from "../../constants/theme";
import type { AppNavigation } from "../../navigation/types";
import { AccountGate, Message } from "./components";
import { statusLabel } from "./OrderSummary";
import {
  notificationActivity,
  notificationTime,
  PAYMENT_LABELS,
} from "./notificationPresentation";

type Props = {
  navigation: AppNavigation;
  signedIn: boolean;
  notices: OrderNotice[];
  order?: Purchase;
  orders: Purchase[];
  unreadCount: number;
  loading: boolean;
  orderLoading: boolean;
  error: string;
  busy: string | null;
  onMarkAll: () => void;
  onOpenNotice: (notice: OrderNotice) => void;
  onOpenOrder: () => void;
};

export function NotificationInboxView({
  navigation,
  signedIn,
  notices,
  order,
  orders,
  unreadCount,
  loading,
  orderLoading,
  error,
  busy,
  onMarkAll,
  onOpenNotice,
  onOpenOrder,
}: Props) {
  const theme = useMobileStore((state) => state.theme);
  const { width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header showBack onBack={navigation.goBack} rightAction="none" />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={s.headingRow}>
            <View style={s.titleGroup}>
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={[s.title, width < 360 && { fontSize: 28 }]}
              >
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View style={s.unread}>
                  <Text style={s.unreadText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
            {signedIn && (
              <TouchableOpacity
                onPress={onMarkAll}
                disabled={!!busy || loading || !unreadCount}
                accessibilityLabel="Mark all notifications as read"
                style={[
                  s.markAll,
                  { opacity: busy || loading || !unreadCount ? 0.45 : 1 },
                ]}
              >
                <Text
                  style={{
                    color: theme.primary,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {busy === "all"
                    ? "Marking…"
                    : unreadCount
                      ? "Mark all read"
                      : "All read"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}
          >
            Latest updates on your order
          </Text>
        </View>
        {!signedIn ? (
          <AccountGate navigate={navigation.navigate} />
        ) : (
          <>
            {!!error && <Message>{error}</Message>}
            {order ? (
              <LinearGradient
                colors={["#125744", BUTTON_COLORS.background]}
                style={s.orderCard}
              >
                <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                  {[0, 1, 2].map((ring) => (
                    <View
                      key={ring}
                      style={[
                        s.ring,
                        {
                          width: 200 + ring * 30,
                          height: 200 + ring * 30,
                          borderRadius: 130,
                          top: -70 - ring * 15,
                          right: -55 - ring * 15,
                        },
                      ]}
                    />
                  ))}
                </View>
                <View style={s.orderMeta}>
                  <Text style={s.eyebrow}>YOUR ORDER</Text>
                  <Text style={s.orderDate}>
                    {notificationTime(order.created_at, true)}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                  style={s.orderNumber}
                >
                  {order.order_number}
                </Text>
                <View style={s.rule} />
                <View style={s.chips}>
                  <View style={s.chip}>
                    <Ionicons
                      name={
                        order.status === "delivered"
                          ? "checkmark"
                          : order.status === "cancelled"
                            ? "close"
                            : "cube-outline"
                      }
                      size={14}
                      color="#103B32"
                    />
                    <Text style={s.chipText}>{statusLabel(order.status)}</Text>
                  </View>
                  <View
                    style={[
                      s.chip,
                      order.payment_status !== "paid" && {
                        backgroundColor: "#F6E8BC",
                      },
                    ]}
                  >
                    <Ionicons name="card-outline" size={14} color="#103B32" />
                    <Text style={s.chipText}>
                      {PAYMENT_LABELS[order.payment_status]}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onOpenOrder}
                  disabled={!!busy}
                  accessibilityLabel={`View order ${order.order_number}`}
                  style={s.viewOrder}
                >
                  <Text style={s.viewLabel}>View Order</Text>
                  <View style={s.arrow}>
                    {busy === "order" ? (
                      <ActivityIndicator size="small" color="#E5C97A" />
                    ) : (
                      <Ionicons
                        name="arrow-forward"
                        size={21}
                        color="#E5C97A"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              orderLoading && (
                <SkeletonPulse>
                  <SkeletonBlock style={{ height: 214, borderRadius: 26 }} />
                </SkeletonPulse>
              )
            )}
            {loading ? (
              <SkeletonPulse style={{ gap: 14, padding: 20 }}>
                <SkeletonBlock style={{ height: 18, width: "45%" }} />
                {[0, 1, 2].map((row) => (
                  <SkeletonBlock key={row} style={{ height: 48 }} />
                ))}
              </SkeletonPulse>
            ) : notices.length ? (
              <>
                <View style={s.sectionHeading}>
                  <Text style={[s.sectionLabel, { color: theme.gold }]}>
                    {notices.every((item) => item.order_id)
                      ? "ORDER ACTIVITY"
                      : "LATEST UPDATES"}
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.border,
                      flex: 1,
                    }}
                  />
                </View>
                <View
                  style={[
                    s.timeline,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSubtle,
                    },
                  ]}
                >
                  {notices.map((notice, index) => {
                    const activity = notificationActivity(notice);
                    const previousDate =
                      index > 0
                        ? notices[index - 1].created_at
                        : order?.created_at;
                    const showDate =
                      notificationTime(notice.created_at, true) !==
                      notificationTime(previousDate || "", true);
                    const otherOrder =
                      notice.order_id && notice.order_id !== order?.id
                        ? orders.find((item) => item.id === notice.order_id)
                        : undefined;
                    const background =
                      activity.tone === "complete"
                        ? BUTTON_COLORS.background
                        : activity.tone === "gold"
                          ? theme.isDark
                            ? theme.goldWarm
                            : "#F9EBC8"
                          : activity.tone === "muted"
                            ? theme.surfaceWarm
                            : theme.isDark
                              ? theme.surfaceWarm
                              : "#E4F0E7";
                    const color =
                      activity.tone === "complete"
                        ? "#FFFDF7"
                        : activity.tone === "gold"
                          ? theme.gold
                          : theme.primary;
                    return (
                      <TouchableOpacity
                        key={notice.id}
                        onPress={() => onOpenNotice(notice)}
                        disabled={!!busy || (notice.read && !notice.order_id)}
                        accessibilityLabel={`${activity.title}${notice.read ? "" : ", unread"}`}
                        accessibilityHint={
                          notice.order_id
                            ? "View this order"
                            : notice.read
                              ? undefined
                              : "Mark this notification as read"
                        }
                        style={s.activity}
                      >
                        <View style={s.iconColumn}>
                          {index < notices.length - 1 && (
                            <View
                              style={[
                                s.connector,
                                { backgroundColor: theme.border },
                              ]}
                            />
                          )}
                          <View
                            style={[
                              s.activityIcon,
                              { backgroundColor: background },
                              !notice.read && {
                                borderWidth: 2,
                                borderColor: "#D8BF7A",
                              },
                            ]}
                          >
                            {busy === notice.id ? (
                              <ActivityIndicator size="small" color={color} />
                            ) : (
                              <Ionicons
                                name={activity.icon}
                                size={19}
                                color={color}
                              />
                            )}
                          </View>
                        </View>
                        <View style={s.activityContent}>
                          <View style={s.activityTop}>
                            <Text style={s.activityTitle}>
                              {activity.title}
                              {!notice.read && (
                                <Text style={{ color: theme.gold }}> •</Text>
                              )}
                            </Text>
                            <Text
                              style={[s.time, { color: theme.textSecondary }]}
                            >
                              {notificationTime(notice.created_at)}
                            </Text>
                          </View>
                          {activity.badge && (
                            <Text
                              style={[
                                s.pending,
                                {
                                  color: theme.gold,
                                  backgroundColor: theme.isDark
                                    ? theme.goldWarm
                                    : "#F9EBC8",
                                },
                              ]}
                            >
                              {activity.badge}
                            </Text>
                          )}
                          {!!otherOrder && (
                            <Text style={{ fontSize: 11, color: theme.gold }}>
                              {otherOrder.order_number}
                            </Text>
                          )}
                          <Text
                            style={[s.body, { color: theme.textSecondary }]}
                          >
                            {notice.body}
                          </Text>
                          {showDate && (
                            <Text
                              style={[
                                s.eventDate,
                                { color: theme.textSecondary },
                              ]}
                            >
                              {notificationTime(notice.created_at, true)}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              !error && (
                <View
                  style={[
                    s.empty,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      s.emptyIcon,
                      { backgroundColor: theme.surfaceWarm },
                    ]}
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={27}
                      color={theme.primary}
                    />
                  </View>
                  <Text style={s.emptyTitle}>You’re all caught up</Text>
                  <Text style={[s.emptyCopy, { color: theme.textSecondary }]}>
                    Order updates and news from Nourish Spoon will appear here.
                  </Text>
                </View>
              )
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 12, gap: 18 },
  headingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  titleGroup: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 34,
    lineHeight: 40,
    flexShrink: 1,
  },
  unread: {
    backgroundColor: BUTTON_COLORS.background,
    borderRadius: 16,
    minWidth: 26,
    height: 26,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { color: "#FFFDF7", fontSize: 12, fontWeight: "700" },
  markAll: {
    minHeight: 44,
    minWidth: 78,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  orderCard: {
    borderRadius: 26,
    padding: 21,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#4C7660",
    shadowColor: "#003E31",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.17,
    shadowRadius: 12,
    elevation: 4,
  },
  ring: { position: "absolute", borderWidth: 1.5, borderColor: "#D8BF7A35" },
  orderMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  eyebrow: {
    color: "#E5C97A",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
  },
  orderDate: { color: "#D2E4DA", fontSize: 12 },
  orderNumber: {
    fontFamily: "serif",
    fontSize: 30,
    lineHeight: 38,
    color: "#FFFDF7",
    marginTop: 9,
    fontWeight: "600",
  },
  rule: {
    height: 1,
    backgroundColor: "#D8BF7A75",
    marginTop: 12,
    marginBottom: 13,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: {
    backgroundColor: "#DCEFE2",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipText: { color: "#103B32", fontSize: 12, fontWeight: "600" },
  viewOrder: {
    minHeight: 50,
    borderRadius: 28,
    backgroundColor: "#FBF6ED",
    paddingLeft: 20,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5C97A",
  },
  viewLabel: { color: "#103B32", fontWeight: "600", fontSize: 15 },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BUTTON_COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionLabel: { fontSize: 10, letterSpacing: 1.6, fontWeight: "500" },
  timeline: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 2,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#003E31",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
    marginTop: -8,
  },
  activity: { flexDirection: "row", gap: 12, minHeight: 78 },
  iconColumn: { width: 38, alignItems: "center" },
  connector: { position: "absolute", top: 35, bottom: -3, width: 1.5 },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: { flex: 1, paddingBottom: 16, gap: 3 },
  activityTop: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  activityTitle: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: "600" },
  time: { fontSize: 11, lineHeight: 20 },
  body: { fontSize: 13, lineHeight: 19 },
  pending: {
    alignSelf: "flex-start",
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
  },
  eventDate: { fontSize: 10, lineHeight: 14 },
  empty: {
    alignItems: "center",
    padding: 26,
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: "serif",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyCopy: { fontSize: 14, lineHeight: 21, textAlign: "center" },
});
