import React, { useState } from "react";
import { Linking, View, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
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
          For an earlier WhatsApp order, paste your consignment number. We’ll
          copy it for the official TCS tracking page.
        </Copy>
        <Field
          label="TCS consignment number"
          value={number}
          onChangeText={(value) => {
            setNumber(value);
            setMessage("");
          }}
          keyboardType="number-pad"
          maxLength={20}
        />
        <GreenButton
          title="Copy & Open TCS"
          disabled={!/^\d{8,20}$/.test(number.trim())}
          onPress={async () => {
            try {
              await Clipboard.setStringAsync(number.trim());
              await Linking.openURL("https://www.tcsexpress.com/track/");
              setMessage(
                "Number copied. Paste it into the TCS tracking field.",
              );
            } catch {
              setMessage("Unable to open TCS. Your number is " + number.trim());
            }
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
