import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { Page, Card, Heading, Copy, Message } from "./components";
import { useAccountData } from "./useAccountData";
import { watchOrders } from "./service";
import { OrderItems, OrderTotals, statusLabel } from "./OrderSummary";
export function OrderConfirmationScreen({
  navigation,
  orderId,
}: {
  navigation: AppNavigation;
  orderId: string;
}) {
  const { items, error, loading } = useAccountData(watchOrders);
  const order = items.find((item) => item.id === orderId);
  return (
    <Page title="Order Placed!" back={() => navigation.navigate("Orders")}>
      <View style={{ alignItems: "center", paddingVertical: 12, gap: 10 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#1B4332",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={38} color="#fff" />
        </View>
        <Text style={{ fontFamily: "serif", fontSize: 26, fontWeight: "700" }}>
          Thank you for your order.
        </Text>
        <Text style={{ fontSize: 14, textAlign: "center", lineHeight: 21 }}>
          Nourish Spoon has received your order.{"\n"}Follow its progress in
          Orders.
        </Text>
      </View>
      {!!error && <Message>{error}</Message>}
      {loading && <Copy>Loading receipt…</Copy>}
      {!loading && !error && !order && (
        <Message>The receipt could not be loaded. Check your Orders.</Message>
      )}
      {order && (
        <>
          <Card>
            <Heading>{order.order_number}</Heading>
            <Copy>
              {new Date(order.created_at).toLocaleString()} ·{" "}
              {statusLabel(order.status)}
            </Copy>
            <Copy>
              {order.quote_pending
                ? "Delivery charges and the final total are awaiting confirmation. No payment has been taken."
                : "Your payment is awaiting verification. See Payment Methods in the menu for transfer details."}
            </Copy>
          </Card>
          <Card>
            <Heading>Delivery Address</Heading>
            <Text style={{ fontWeight: "700" }}>{order.customer_name}</Text>
            <Copy>
              {order.customer_phone}
              {"\n"}
              {order.delivery_address}, {order.delivery_city}
            </Copy>
          </Card>
          <Card>
            <Heading>Order Items</Heading>
            <OrderItems items={order.items} />
            <OrderTotals
              subtotal={order.subtotal}
              fee={order.delivery_fee}
              total={order.total}
            />
          </Card>
          <GreenButton
            title="Track Order"
            onPress={() => navigation.navigate("OrderTracking", { orderId })}
          />
        </>
      )}
      <GreenButton
        title="Continue Shopping"
        onPress={() => navigation.navigate("Products")}
      />
    </Page>
  );
}
