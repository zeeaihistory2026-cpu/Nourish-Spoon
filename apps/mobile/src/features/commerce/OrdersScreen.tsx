import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { AppNavigation } from "../../navigation/types";
import {
  Page,
  Card,
  Heading,
  Copy,
  Message,
  AccountGate,
  Choice,
} from "./components";
import { Text } from "../../components/DesignPrimitives";
import { watchOrders } from "./service";
import { useAccountData } from "./useAccountData";
import { useMobileStore } from "../../services/storeService";
import { formatPKR } from "@packages/utils";
import { OrderItems, statusLabel } from "./OrderSummary";
export function OrdersScreen({ navigation }: { navigation: AppNavigation }) {
  const { user, items, error, loading } = useAccountData(watchOrders);
  const { theme } = useMobileStore();
  const [filter, setFilter] = useState("All");
  const filtered = items.filter(
    (order) =>
      filter === "All" ||
      (filter === "Active"
        ? !["delivered", "cancelled"].includes(order.status)
        : filter === "Completed"
          ? order.status === "delivered"
          : order.status === "cancelled"),
  );
  return (
    <Page
      title="My Orders"
      subtitle="Your orders, receipts and favourites to reorder."
      back={navigation.goBack}
    >
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {["All", "Active", "Completed", "Cancelled"].map((value) => (
              <Choice
                key={value}
                title={value}
                selected={filter === value}
                onPress={() => setFilter(value)}
              />
            ))}
          </View>
          {!!error && <Message>{error}</Message>}
          {loading && <Copy>Loading your orders…</Copy>}
          {!loading && !error && !filtered.length && (
            <Card>
              <Heading>
                {items.length ? "No orders in this category" : "No orders yet"}
              </Heading>
              <Copy>Orders placed in the app will appear here.</Copy>
            </Card>
          )}
          {filtered.map((order) => (
            <Card key={order.id}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 6,
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 17 }}>
                  {order.order_number}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.primary,
                    backgroundColor: theme.surfaceWarm,
                    padding: 6,
                    borderRadius: 10,
                  }}
                >
                  {statusLabel(order.status)}
                </Text>
              </View>
              <Copy>{new Date(order.created_at).toLocaleDateString()}</Copy>
              <OrderItems items={order.items} />
              <Text style={{ fontWeight: "700" }}>
                {order.total == null
                  ? `Products ${formatPKR(order.subtotal)} · delivery quote pending`
                  : `Total ${formatPKR(order.total)}`}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[
                  { title: "View Details", route: "OrderDetails" as const },
                  { title: "Track Order", route: "OrderTracking" as const },
                ].map((action) => (
                  <TouchableOpacity
                    key={action.title}
                    accessibilityRole="button"
                    accessibilityLabel={`${action.title} ${order.order_number}`}
                    onPress={() =>
                      navigation.navigate(action.route, { orderId: order.id })
                    }
                    style={{
                      flex: 1,
                      minHeight: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          ))}
        </>
      )}
    </Page>
  );
}
