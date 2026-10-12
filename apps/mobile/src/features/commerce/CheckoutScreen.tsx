import { AppNavigation } from "../../navigation/types";
import React, { useRef, useState } from "react";
import { View, Switch, Linking } from "react-native";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { useMobileStore } from "../../services/storeService";
import {
  Page,
  Card,
  Heading,
  Copy,
  Field,
  Choice,
  Message,
  AccountGate,
} from "./components";
import { useAccountData } from "./useAccountData";
import { watchAddresses, placeOrder, commerceError } from "./service";
import { formatPKR } from "@packages/utils";
export function CheckoutScreen({ navigation }: { navigation: AppNavigation }) {
  const { cart, clearCart, theme, settings } = useMobileStore();
  const { user, items: addresses } = useAccountData(watchAddresses);
  const [name, setName] = useState(user?.displayName || ""),
    [phone, setPhone] = useState(""),
    [city, setCity] = useState(""),
    [line, setLine] = useState("");
  const [delivery, setDelivery] = useState("tcs_nationwide"),
    [payment, setPayment] = useState("bank_transfer");
  const [gift, setGift] = useState(false),
    [giftMessage, setGiftMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  // Retain the request ID across retries to prevent duplicate orders.
  const requestId = useRef(
    `${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`,
  );
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.variant.sale_price ?? item.variant.regular_price) * item.quantity,
    0,
  );
  async function submit() {
    if (busy) return;
    if (![name, phone, city, line].every((value) => value.trim())) {
      setError("Complete your name, mobile number, city and address.");
      return;
    }
    if (!/^(?:\+?92|0)?3\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setError("Enter a valid Pakistani mobile number.");
      return;
    }
    if (
      delivery === "sargodha_sameday" &&
      city.trim().toLowerCase() !== "sargodha"
    ) {
      setError("Choose TCS Nationwide for this city.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const order = await placeOrder({
        request_id: requestId.current,
        items: cart.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant.id,
          quantity: item.quantity,
        })),
        address: { name, phone, city, line },
        delivery_method: delivery,
        payment_method: payment,
        is_gift: gift,
        gift_message: giftMessage,
      });
      clearCart();
      navigation.navigate("OrderDetails", { orderId: order.id });
    } catch (error) {
      setError(commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  async function whatsapp() {
    const details = cart
      .map(
        (item) =>
          `${item.product.name} ${item.variant.weight} × ${item.quantity}`,
      )
      .join("\n");
    const message = `Hello Nourish Spoon! Please confirm this order:\n${details}\nProducts subtotal: ${formatPKR(subtotal)}\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nAddress: ${line}\nDelivery: ${delivery}\nPayment: ${payment}${gift ? "\nGift message: " + giftMessage : ""}\nPlease confirm delivery charges and final total.`;
    try {
      await Linking.openURL(
        `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
      );
    } catch {
      setError("Could not open WhatsApp. Please try again.");
    }
  }
  return (
    <Page title="Checkout" back={navigation.goBack}>
      {!cart.length ? (
        <Card>
          <Heading>Your cart is empty</Heading>
          <GreenButton
            title="Explore Products"
            onPress={() => navigation.navigate("Products")}
          />
        </Card>
      ) : (
        <>
          {!user && <AccountGate navigate={navigation.navigate} />}
          <Card>
            <Heading>Delivery details</Heading>
            {addresses.map((address) => (
              <Choice
                key={address.id}
                title={`${address.label}: ${address.city}`}
                onPress={() => {
                  setName(address.name);
                  setPhone(address.phone);
                  setCity(address.city);
                  setLine(address.line);
                }}
              />
            ))}
            <Field
              label="Full name"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              maxLength={80}
            />
            <Field
              label="Mobile number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={30}
            />
            <Field
              label="Delivery city"
              placeholder="Enter your city"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              maxLength={80}
            />
            <Field
              label="Street address"
              value={line}
              onChangeText={setLine}
              placeholder="House, street and area"
              autoComplete="street-address"
              maxLength={300}
              multiline
            />
          </Card>
          <Card>
            <Heading>Delivery & payment</Heading>
            {[
              ["tcs_nationwide", "TCS Nationwide · 2–3 working days"],
              ["sargodha_sameday", "Same-day · Sargodha only"],
              ["self_pickup", "Self Pickup · Sargodha"],
            ].map(([code, label]) => (
              <Choice
                key={code}
                title={label}
                selected={delivery === code}
                onPress={() => setDelivery(code)}
              />
            ))}
            {useMobileStore
              .getState()
              .paymentMethods.filter((method) => method.active)
              .map((method) => (
                <Choice
                  key={method.code}
                  title={method.name}
                  selected={payment === method.code}
                  onPress={() => setPayment(method.code)}
                />
              ))}
            <Copy>
              Payment instructions are available in the menu. A payment transfer
              is confirmed by Nourish Spoon after verification.
            </Copy>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>This is a gift</Text>
              <Switch
                accessibilityLabel="Gift order"
                value={gift}
                onValueChange={setGift}
                trackColor={{ true: theme.primary, false: theme.border }}
              />
            </View>
            {gift && (
              <Field
                label="Gift message (optional)"
                value={giftMessage}
                onChangeText={setGiftMessage}
                multiline
                maxLength={400}
              />
            )}
          </Card>
          <Card>
            <Heading>Products {formatPKR(subtotal)}</Heading>
            <Copy>
              {delivery === "self_pickup"
                ? "Pickup has no delivery charge."
                : "The delivery charge and final total will be confirmed by Nourish Spoon. No payment is taken by this button."}
            </Copy>
            {!!error && <Message>{error}</Message>}
            <GreenButton
              title={busy ? "Placing order…" : "Place Order"}
              onPress={submit}
              disabled={busy || !user}
            />
            <GreenButton
              title="Send Cart on WhatsApp"
              whatsapp
              onPress={whatsapp}
              disabled={busy}
            />
          </Card>
        </>
      )}
    </Page>
  );
}
