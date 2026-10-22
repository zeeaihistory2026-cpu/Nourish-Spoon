import { View, Image } from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useInfoDialog } from "../components/InfoDialog";
import { Text } from "../components/DesignPrimitives";
import { Page, Card, Copy } from "../features/commerce/components";
import { useMobileStore } from "../services/storeService";
import { ASSETS } from "../constants/assets";
export function PaymentDeliveryScreen({
  onBack,
  initialSection = "payment",
}: {
  onBack: () => void;
  initialSection?: "payment" | "delivery";
}) {
  const { showInfo, dialog } = useInfoDialog();
  const { theme, paymentMethods, deliveryMethods, settings } = useMobileStore();
  const payment = initialSection === "payment";
  const rows = payment
    ? paymentMethods
        .filter((method) => method.active)
        .map((method) => ({
          id: method.id,
          title: method.name,
          description: method.subtext,
          image:
            method.code === "bank_transfer"
              ? ASSETS.iconBank
              : method.code === "easypaisa"
                ? ASSETS.iconEasyPaisa
                : ASSETS.iconJazzCash,
          action: () =>
            showInfo(
              method.name,
              `Contact Nourish Spoon at ${settings.whatsapp_number} for current ${method.name} account details. Share your transaction receipt on WhatsApp so the team can verify your payment.`,
            ),
        }))
    : deliveryMethods
        .filter((method) => method.active)
        .map((method) => ({
          id: method.id,
          title: method.title,
          description: method.subtitle,
          image:
            method.code === "sargodha_sameday"
              ? ASSETS.iconDeliverySargodha
              : method.code === "tcs_nationwide"
                ? ASSETS.iconDeliveryTcs
                : method.code === "foodpanda_sargodha"
                  ? ASSETS.iconDeliveryFoodpanda
                  : ASSETS.iconDeliveryPickup,
          action: () =>
            showInfo(
              method.title,
              `${method.description}\n\nEstimated time: ${method.estimated_time}\nDelivery: ${method.code === "self_pickup" ? "Free pickup" : "Rs. 250. Free when the product total after discounts exceeds Rs. 2,500."}`,
            ),
        }));
  return (
    <Page
      title={payment ? "Payment Methods" : "Delivery Information"}
      subtitle={
        payment
          ? "Simple, secure advance payments."
          : "Handmade goodness, delivered across Pakistan."
      }
      back={onBack}
    >
      {dialog}
      {rows.map((row) => (
        <TouchableOpacity
          key={row.id}
          accessibilityRole="button"
          accessibilityLabel={row.title}
          onPress={row.action}
        >
          <Card>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Image
                source={row.image}
                resizeMode="contain"
                style={{ width: 42, height: 42 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "serif",
                    fontWeight: "700",
                    fontSize: 22,
                  }}
                >
                  {row.title}
                </Text>
                <Copy>{row.description}</Copy>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.textSecondary}
              />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      {payment && (
        <Card>
          <Copy>
            Orders require advance payment. Cash on delivery is unavailable.
            Payment transfers are verified by Nourish Spoon.
          </Copy>
        </Card>
      )}
    </Page>
  );
}
