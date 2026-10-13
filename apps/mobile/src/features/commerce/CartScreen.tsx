import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import { AppNavigation } from "../../navigation/types";
import { useMobileStore } from "../../services/storeService";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { ProductArtwork } from "../../components/ProductArtwork";
import { formatPKR } from "@packages/utils";
import { Page, Card, Heading, Copy } from "./components";
export function CartScreen({ navigation }: { navigation: AppNavigation }) {
  const { cart, products, updateQuantity, removeFromCart, theme } =
    useMobileStore();
  const unavailable = cart.some(
    (item) =>
      !products.some(
        (product) =>
          product.id === item.product.id &&
          product.active &&
          product.variants.some(
            (variant) => variant.id === item.variant.id && variant.active,
          ),
      ),
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.variant.sale_price ?? item.variant.regular_price) * item.quantity,
    0,
  );
  return (
    <Page
      title="Your Cart"
      subtitle="Wholesome goodness, one step closer to you."
      back={navigation.goBack}
    >
      {!cart.length ? (
        <Card>
          <Heading>Your cart is empty</Heading>
          <Copy>Choose some handmade goodness to get started.</Copy>
          <GreenButton
            title="Explore Products"
            onPress={() => navigation.navigate("Products")}
          />
        </Card>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.variant.id}>
              <View style={s.row}>
                <View style={[s.image, { backgroundColor: theme.surfaceWarm }]}>
                  <ProductArtwork product={item.product} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={s.name}>{item.product.name}</Text>
                  <Copy>{item.variant.weight}</Copy>
                  <View style={[s.stepper, { borderColor: theme.border }]}>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Decrease ${item.product.name} quantity`}
                      disabled={item.quantity <= 1}
                      onPress={() =>
                        updateQuantity(item.variant.id, item.quantity - 1)
                      }
                      style={[
                        s.step,
                        { opacity: item.quantity <= 1 ? 0.35 : 1 },
                      ]}
                    >
                      <Ionicons name="remove" size={18} color={theme.text} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Increase ${item.product.name} quantity`}
                      disabled={item.quantity >= 20}
                      onPress={() =>
                        updateQuantity(item.variant.id, item.quantity + 1)
                      }
                      style={[
                        s.step,
                        { opacity: item.quantity >= 20 ? 0.35 : 1 },
                      ]}
                    >
                      <Ionicons name="add" size={18} color={theme.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={s.totalRow}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: theme.isDark ? theme.gold : "#805025",
                  }}
                >
                  {formatPKR(
                    (item.variant.sale_price ?? item.variant.regular_price) *
                      item.quantity,
                  )}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.product.name}`}
                  onPress={() => removeFromCart(item.variant.id)}
                  style={s.step}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
          <Card>
            <Heading>Order Summary</Heading>
            <View style={s.totalRow}>
              <Copy>Products ({count} items)</Copy>
              <Text style={{ fontSize: 17, fontWeight: "700" }}>
                {formatPKR(subtotal)}
              </Text>
            </View>
            <View style={s.totalRow}>
              <Copy>Delivery charges</Copy>
              <Text style={{ fontSize: 13 }}>Confirmed at checkout</Text>
            </View>
            <Copy>
              {unavailable
                ? "Remove unavailable recipes or sizes before checkout."
                : "We’ll check current prices and availability when you place your order."}
            </Copy>
          </Card>
          <GreenButton
            title="Proceed to Checkout"
            disabled={unavailable}
            onPress={() => navigation.navigate("Checkout")}
          />
        </>
      )}
    </Page>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  image: { width: 88, height: 88, borderRadius: 10, overflow: "hidden" },
  name: {
    fontFamily: "serif",
    fontSize: 22,
    lineHeight: 23,
    fontWeight: "700",
  },
  stepper: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 9,
    marginTop: 8,
  },
  step: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
});
