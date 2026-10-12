import { AppNavigation } from "../../navigation/types";
import React, { useState } from "react";
import { Linking } from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Page,
  Card,
  Heading,
  Copy,
  Message,
  Field,
  AccountGate,
} from "./components";
import { GreenButton } from "../../components/DesignPrimitives";
import { watchOrders } from "./service";
import { useAccountData } from "./useAccountData";
import { formatPKR } from "@packages/utils";
export function OrdersScreen({
  navigation,
  tracking = false,
}: {
  navigation: AppNavigation;
  tracking?: boolean;
}) {
  const { user, items, error, loading } = useAccountData(watchOrders);
  const [number, setNumber] = useState(""),
    [message, setMessage] = useState("");
  const valid = /^\d{8,20}$/.test(number.trim());
  return (
    <Page
      title={tracking ? "Track Order" : "My Orders"}
      back={navigation.goBack}
    >
      {tracking && (
        <Card>
          <Heading>Have a TCS number?</Heading>
          <Copy>
            You can also track an earlier WhatsApp order. Copy your consignment
            number, open TCS, and paste it into their tracking field.
          </Copy>
          <Field
            label="TCS consignment number"
            value={number}
            onChangeText={setNumber}
            keyboardType="number-pad"
            maxLength={20}
          />
          <GreenButton
            title="Copy & Open TCS"
            disabled={!valid}
            onPress={async () => {
              try {
                await Clipboard.setStringAsync(number.trim());
                await Linking.openURL("https://www.tcsexpress.com/track/");
              } catch {
                setMessage(
                  "Unable to open TCS. Your number is " + number.trim(),
                );
              }
            }}
          />
          {!!message && <Message>{message}</Message>}
        </Card>
      )}
      {!user ? (
        <AccountGate navigate={navigation.navigate} />
      ) : (
        <>
          {!!error && <Message>{error}</Message>}
          {loading && <Copy>Loading your orders…</Copy>}
          {!loading && !error && !items.length && (
            <Card>
              <Heading>No orders yet</Heading>
              <Copy>
                Orders placed in this app will appear here. For an earlier
                WhatsApp order, contact Nourish Spoon for your TCS number.
              </Copy>
              <GreenButton
                title="Explore Products"
                onPress={() => navigation.navigate("Products")}
              />
            </Card>
          )}
          {items.map((order) => (
            <Card key={order.id}>
              <Heading>{order.order_number}</Heading>
              <Copy>
                {new Date(order.created_at).toLocaleDateString()} ·{" "}
                {order.status.replace(/_/g, " ")}
                {"\n"}
                {order.items
                  .map(
                    (item) =>
                      `${item.product_name} ${item.variant_weight} × ${item.quantity}`,
                  )
                  .join("\n")}
              </Copy>
              <Copy>
                {order.total == null
                  ? `Products ${formatPKR(order.subtotal)} · delivery quote pending`
                  : `Total ${formatPKR(order.total)}`}
              </Copy>
              <GreenButton
                title={tracking ? "View Tracking" : "View Order"}
                onPress={() =>
                  navigation.navigate("OrderDetails", { orderId: order.id })
                }
              />
            </Card>
          ))}
        </>
      )}
    </Page>
  );
}
