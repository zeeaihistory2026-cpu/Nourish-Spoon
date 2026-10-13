import React, { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
import {
  Page,
  Card,
  Heading,
  Copy,
  Message,
  Field,
  AccountGate,
} from "./components";
import { GreenButton, Text } from "../../components/DesignPrimitives";
import { watchOrders } from "./service";
import { useAccountData } from "./useAccountData";
import { useMobileStore } from "../../services/storeService";
import { statusLabel } from "./OrderSummary";
export function TrackOrderScreen({
  navigation,
}: {
  navigation: AppNavigation;
}) {
  const { user, items, error, loading } = useAccountData(watchOrders);
  const { theme } = useMobileStore();
  const [number, setNumber] = useState(""),
    [message, setMessage] = useState("");
  const active = items.filter(
    (order) => !["delivered", "cancelled"].includes(order.status),
  );
  return (
    <Page
      title="Track Order"
      subtitle="Follow your order, from our kitchen to you."
      back={navigation.goBack}
    >
      <Card>
        <Heading>Have a TCS number?</Heading>
        <Copy>
          Enter the consignment number from your order or WhatsApp message to
          check it with TCS inside the app.
        </Copy>
        <Field
          label="TCS consignment number"
          value={number}
          onChangeText={(value) => {
            setNumber(value);
            setMessage("");
          }}
          keyboardType="number-pad"
          placeholder="Enter your TCS number"
          maxLength={20}
        />
        <GreenButton
          title="Track Shipment"
          onPress={() => {
            if (!/^\d{8,20}$/.test(number.trim())) {
              setMessage("Enter a valid TCS consignment number (8–20 digits).");
              return;
            }
            navigation.navigate("TcsTracking", {
              trackingNumber: number.trim(),
            });
          }}
        />
        {!!message && <Message>{message}</Message>}
      </Card>
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          <Heading>Active Orders</Heading>
          {!!error && <Message>{error}</Message>}
          {loading && <Copy>Loading orders…</Copy>}
          {!loading && !error && !active.length && (
            <Copy>No active orders. Completed orders are in Orders.</Copy>
          )}
          {active.map((order) => (
            <TouchableOpacity
              key={order.id}
              accessibilityRole="button"
              accessibilityLabel={`Track ${order.order_number}`}
              onPress={() =>
                navigation.navigate("OrderTracking", { orderId: order.id })
              }
            >
              <Card>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="cube-outline"
                    size={26}
                    color={theme.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>
                      {order.order_number}
                    </Text>
                    <Copy>{statusLabel(order.status)}</Copy>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.text}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </>
      )}
    </Page>
  );
}
