import { AppNavigation } from "../../navigation/types";
import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMobileStore } from "../../services/storeService";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { ASSETS } from "../../constants/assets";
import { formatPKR } from "@packages/utils";
import { Page, Card, Heading, Copy } from "./components";
export function CartScreen({ navigation }: { navigation: AppNavigation }) {
  const { cart, updateQuantity, removeFromCart, theme } = useMobileStore();
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.variant.sale_price ?? item.variant.regular_price) * item.quantity,
    0,
  );
  return (
    <Page title="Your Cart" back={navigation.goBack}>
      {!cart.length ? (
        <Card>
          <Heading>Your cart is empty</Heading>
          <Copy>Choose a jar of handmade goodness to get started.</Copy>
          <GreenButton
            title="Explore Products"
            onPress={() => navigation.navigate("Products")}
          />
        </Card>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.variant.id}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Image
                  source={
                    item.product.category === "panjeeri"
                      ? ASSETS.panjeeriCard
                      : ASSETS.energyBallsCard
                  }
                  style={{ width: 68, height: 68, borderRadius: 10 }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700", fontSize: 16 }}>
                    {item.product.name}
                  </Text>
                  <Copy>
                    {item.variant.weight} ·{" "}
                    {formatPKR(
                      item.variant.sale_price ?? item.variant.regular_price,
                    )}
                  </Copy>
                </View>
                <TouchableOpacity
                  accessibilityLabel={`Remove ${item.product.name}`}
                  onPress={() => removeFromCart(item.variant.id)}
                  style={{ padding: 10 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    accessibilityLabel={`Decrease ${item.product.name} quantity`}
                    disabled={item.quantity <= 1}
                    onPress={() =>
                      updateQuantity(item.variant.id, item.quantity - 1)
                    }
                    style={{
                      padding: 12,
                      opacity: item.quantity <= 1 ? 0.4 : 1,
                    }}
                  >
                    <Ionicons name="remove" size={20} color={theme.primary} />
                  </TouchableOpacity>
                  <Text>{item.quantity}</Text>
                  <TouchableOpacity
                    accessibilityLabel={`Increase ${item.product.name} quantity`}
                    disabled={item.quantity >= 20}
                    onPress={() =>
                      updateQuantity(item.variant.id, item.quantity + 1)
                    }
                    style={{ padding: 12 }}
                  >
                    <Ionicons name="add" size={20} color={theme.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontWeight: "700" }}>
                  {formatPKR(
                    (item.variant.sale_price ?? item.variant.regular_price) *
                      item.quantity,
                  )}
                </Text>
              </View>
            </Card>
          ))}
          <Card>
            <Heading>Subtotal {formatPKR(subtotal)}</Heading>
            <Copy>
              Delivery is calculated or confirmed at checkout. Prices and
              availability are checked when you place your order.
            </Copy>
            <GreenButton
              title="Continue to Checkout"
              onPress={() => navigation.navigate("Checkout")}
            />
          </Card>
        </>
      )}
    </Page>
  );
}
