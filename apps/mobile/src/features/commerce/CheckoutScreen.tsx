import React, { useEffect, useState } from "react";
import { View, Switch, Linking } from "react-native";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
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
import { OrderItems, OrderTotals } from "./OrderSummary";
import { SavingsCard, SavingsQuote } from "./SavingsCard";
import { useAccountData } from "./useAccountData";
import { watchAddresses, placeOrder, commerceError } from "./service";
import { useCheckoutField, clearCheckoutDraft } from "./checkoutDraft";
import { firebaseAuth } from "../../services/firebase";
import { formatPKR } from "@packages/utils";
export function CheckoutScreen({ navigation }: { navigation: AppNavigation }) {
  const { cart, clearCart, theme, settings, paymentMethods } = useMobileStore();
  const {
    user,
    items: addresses,
    error: addressesError,
  } = useAccountData(watchAddresses);
  const methods = paymentMethods.filter((method) => method.active);
  const [step, setStep] = useCheckoutField("step");
  const [name, setName] = useCheckoutField("name"),
    [phone, setPhone] = useCheckoutField("phone"),
    [city, setCity] = useCheckoutField("city"),
    [line, setLine] = useCheckoutField("line");
  const [delivery, setDelivery] = useCheckoutField("delivery"),
    [payment, setPayment] = useCheckoutField("payment");
  const [gift, setGift] = useCheckoutField("gift"),
    [giftMessage, setGiftMessage] = useCheckoutField("giftMessage");
  const [requestId] = useCheckoutField("requestId");
  const [promoCode] = useCheckoutField("promoCode"),
    [rewardPoints] = useCheckoutField("rewardPoints");
  const [quote, setQuote] = useState<SavingsQuote | null>(null);
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!name && user?.displayName) setName(user.displayName);
  }, [user?.uid]);
  const orderItems = cart.map((item) => ({
    product_id: item.product.id,
    variant_id: item.variant.id,
    quantity: item.quantity,
    product_name: item.product.name,
    variant_weight: item.variant.weight,
    unit_price: item.variant.sale_price ?? item.variant.regular_price,
    total_price:
      (item.variant.sale_price ?? item.variant.regular_price) * item.quantity,
  }));
  const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
  function validAddress() {
    if (![name, phone, city, line].every((value) => value.trim())) {
      setError("Complete your name, mobile number, city and address.");
      return false;
    }
    if (!/^(?:\+?92|0)?3\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setError("Enter a valid Pakistani mobile number.");
      return false;
    }
    if (
      delivery === "sargodha_sameday" &&
      city.trim().toLowerCase() !== "sargodha"
    ) {
      setError("Choose TCS Nationwide for this city.");
      return false;
    }
    setError("");
    return true;
  }
  function advance() {
    if (step === 0 && !validAddress()) return;
    if (step === 1 && !methods.some((method) => method.code === payment)) {
      setError("Choose an available payment method.");
      return;
    }
    setError("");
    setStep((value) => Math.min(value + 1, 2));
  }
  async function submit() {
    if (busy || !validAddress()) return;
    if ((promoCode.trim() || Number(rewardPoints)) && !quote) {
      setError("Apply your promo code or points before placing the order.");
      return;
    }
    if (!methods.some((method) => method.code === payment)) {
      setError("Choose an available payment method.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const order = await placeOrder({
        request_id: requestId,
        items: cart.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant.id,
          quantity: item.quantity,
        })),
        address: {
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          line: line.trim(),
        },
        delivery_method: delivery,
        payment_method: payment,
        is_gift: gift,
        gift_message: giftMessage,
        promo_code: promoCode.trim().toUpperCase(),
        reward_points: Number(rewardPoints || 0),
      });
      clearCart();
      clearCheckoutDraft();
      navigation.navigate("OrderConfirmation", { orderId: order.id });
    } catch (error) {
      setError(commerceError(error));
    } finally {
      setBusy(false);
    }
  }
  async function whatsapp() {
    if (!firebaseAuth?.currentUser || firebaseAuth.currentUser.isAnonymous) {
      navigation.navigate("Login");
      return;
    }
    if (!validAddress()) {
      setStep(0);
      return;
    }
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
    <Page
      title="Checkout"
      subtitle="Healthy choices. Brighter tomorrows."
      back={() => (step && !busy ? setStep(step - 1) : navigation.goBack())}
    >
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
          <View style={{ flexDirection: "row", gap: 8, paddingVertical: 8 }}>
            {[
              { label: "Delivery", icon: "location-outline" as const },
              { label: "Payment", icon: "card-outline" as const },
              { label: "Review", icon: "checkmark-outline" as const },
            ].map((item, index) => (
              <TouchableOpacity
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={`${item.label} step`}
                accessibilityState={{
                  selected: step === index,
                  disabled: index > step || busy,
                }}
                disabled={index > step || busy}
                onPress={() => {
                  setStep(index);
                  setError("");
                }}
                style={{ flex: 1, alignItems: "center", gap: 4 }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: index <= step ? theme.primary : theme.border,
                    backgroundColor: index === step ? "#1B4332" : theme.surface,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={index === step ? "#fff" : theme.text}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: index === step ? "700" : "400",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {step === 0 && (
            <>
              <Card>
                <Heading>Delivery Address</Heading>
                {!!addressesError && <Message>{addressesError}</Message>}
                {addresses.map((address) => (
                  <Choice
                    key={address.id}
                    title={`${address.label}: ${address.city}`}
                    selected={
                      line === address.line &&
                      city === address.city &&
                      phone === address.phone
                    }
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
                <Heading>Delivery Method</Heading>
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
                <Copy>
                  Delivery charges are confirmed by Nourish Spoon. Pickup has no
                  delivery charge.
                </Copy>
              </Card>
            </>
          )}
          {step === 1 && (
            <Card>
              <Heading>Payment Method</Heading>
              {methods.map((method) => (
                <Choice
                  key={method.code}
                  title={method.name}
                  selected={payment === method.code}
                  onPress={() => setPayment(method.code)}
                />
              ))}
              {!methods.length && (
                <Message>
                  No payment methods are available. Please contact Nourish
                  Spoon.
                </Message>
              )}
              <Copy>
                These are manual transfers. No payment is taken in the app;
                Nourish Spoon verifies your transfer.
              </Copy>
              <GreenButton
                title="View Payment Instructions"
                onPress={() =>
                  navigation.navigate("PaymentDelivery", { section: "payment" })
                }
              />
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
          )}
          {step === 2 && (
            <>
              <SavingsCard
                items={cart.map((item) => ({
                  product_id: item.product.id,
                  variant_id: item.variant.id,
                  quantity: item.quantity,
                }))}
                delivery={delivery}
                onQuote={setQuote}
              />
              <Card>
                <Heading>Delivery Details</Heading>
                <Text style={{ fontWeight: "700" }}>{name}</Text>
                <Copy>
                  {phone}
                  {"\n"}
                  {line}, {city}
                  {"\n"}
                  {delivery.replace(/_/g, " ")}
                </Copy>
                <Choice
                  title="Change Delivery Details"
                  onPress={() => setStep(0)}
                />
              </Card>
              <Card>
                <Heading>Order Summary</Heading>
                <OrderItems items={orderItems} />
                <Copy>
                  Payment:{" "}
                  {methods.find((method) => method.code === payment)?.name ||
                    "Unavailable"}
                  {gift
                    ? "\nGift message: " + (giftMessage || "No message")
                    : ""}
                </Copy>
                <OrderTotals
                  subtotal={subtotal}
                  fee={
                    quote
                      ? quote.delivery_fee
                      : delivery === "self_pickup"
                        ? 0
                        : null
                  }
                  total={
                    quote
                      ? quote.total
                      : delivery === "self_pickup"
                        ? subtotal
                        : null
                  }
                  promoDiscount={quote?.promo_discount}
                  rewardDiscount={quote?.reward_discount}
                />
                <Copy>
                  Prices and availability are verified when the order is
                  submitted. Delivery charges may need confirmation.
                </Copy>
              </Card>
              {!user && <AccountGate navigate={navigation.navigate} />}
            </>
          )}
          {!!error && <Message>{error}</Message>}
          {step < 2 ? (
            <GreenButton
              title={step === 0 ? "Continue to Payment" : "Review Order"}
              onPress={advance}
            />
          ) : (
            <>
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
            </>
          )}
        </>
      )}
    </Page>
  );
}
