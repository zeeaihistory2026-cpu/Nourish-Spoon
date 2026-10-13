import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { useMobileStore } from "../../services/storeService";
import { useAccountData } from "./useAccountData";
import { watchOrders } from "./service";
import { Page, Card, Heading, Copy, Message } from "./components";
import { ORDER_STAGES, OrderItems, statusLabel } from "./OrderSummary";
export function OrderTrackingScreen({
  navigation,
  orderId,
}: {
  navigation: AppNavigation;
  orderId: string;
}) {
  const { items, error, loading } = useAccountData(watchOrders);
  const { theme } = useMobileStore();
  const order = items.find((item) => item.id === orderId);
  return (
    <Page title="Order Tracking" back={navigation.goBack}>
      {!!error && <Message>{error}</Message>}
      {loading && <Copy>Loading order…</Copy>}
      {!loading && !error && !order && (
        <Message>This order is unavailable for your account.</Message>
      )}
      {order && (
        <>
          <View
            style={{
              backgroundColor: "#1B4332",
              borderRadius: 14,
              padding: 16,
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Ionicons
              name={
                order.status === "cancelled"
                  ? "close-circle-outline"
                  : "car-outline"
              }
              size={30}
              color="#fff"
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 19, fontWeight: "700" }}>
                {statusLabel(order.status)}
              </Text>
              <Text style={{ color: "#E7EFDF", fontSize: 13 }}>
                {order.order_number}
              </Text>
            </View>
          </View>
          <Card>
            <Heading>Order progress</Heading>
            {order.status === "cancelled" ? (
              <Copy>This order was cancelled.</Copy>
            ) : (
              ORDER_STAGES.map((stage, index) => {
                const current = ORDER_STAGES.findIndex(
                  (stage) => stage.status === order.status,
                );
                const reached = index <= current;
                const recorded =
                  order.status_history?.find(
                    (event) => event.status === stage.status,
                  )?.at || (index === 0 ? order.created_at : undefined);
                return (
                  <View
                    key={stage.status}
                    style={{ flexDirection: "row", gap: 12, minHeight: 68 }}
                  >
                    <View style={{ alignItems: "center", width: 26 }}>
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: reached
                            ? theme.primary
                            : theme.border,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {reached && (
                          <Ionicons
                            name="checkmark"
                            size={17}
                            color={theme.isDark ? theme.background : "#fff"}
                          />
                        )}
                      </View>
                      {index < ORDER_STAGES.length - 1 && (
                        <View
                          style={{
                            width: 2,
                            flex: 1,
                            backgroundColor:
                              index < current ? theme.primary : theme.border,
                            marginVertical: 3,
                          }}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1, paddingBottom: 12 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: reached ? theme.text : theme.textMuted,
                        }}
                      >
                        {stage.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 18,
                          color: theme.textSecondary,
                        }}
                      >
                        {recorded
                          ? new Date(recorded).toLocaleString()
                          : reached
                            ? "Completed · time unavailable"
                            : "Next"}
                      </Text>
                      {index === current && <Copy>{stage.copy}</Copy>}
                    </View>
                  </View>
                );
              })
            )}
          </Card>
          <Card>
            <Heading>
              {order.delivery_method_code === "tcs_nationwide"
                ? "TCS Tracking"
                : "Delivery Information"}
            </Heading>
            {order.tracking_number ? (
              <>
                <Text style={{ fontSize: 20, letterSpacing: 1 }}>
                  {order.tracking_number}
                </Text>
                <GreenButton
                  title="Track with TCS"
                  onPress={() =>
                    navigation.navigate("TcsTracking", {
                      trackingNumber: order.tracking_number,
                    })
                  }
                />
                <Copy>
                  Live courier scans are provided by TCS. The stages above are
                  updated by Nourish Spoon.
                </Copy>
              </>
            ) : (
              <Copy>
                {order.delivery_method_code === "tcs_nationwide"
                  ? "Your consignment number will appear when the parcel is dispatched."
                  : order.delivery_method_code === "self_pickup"
                    ? "Nourish Spoon will contact you when your order is ready for collection."
                    : "Nourish Spoon will contact you to arrange delivery."}
              </Copy>
            )}
          </Card>
          <Card>
            <Heading>Order Items</Heading>
            <OrderItems items={order.items} />
            <GreenButton
              title="View Order Receipt"
              onPress={() => navigation.navigate("OrderDetails", { orderId })}
            />
          </Card>
        </>
      )}
    </Page>
  );
}
