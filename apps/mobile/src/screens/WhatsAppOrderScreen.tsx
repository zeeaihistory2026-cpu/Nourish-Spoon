import { useInfoDialog } from "../components/InfoDialog";
import { Text } from "../components/DesignPrimitives";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import { Header } from "../components/Header";
import { useMobileStore } from "../services/storeService";
import { ASSETS } from "../constants/assets";
import {
  formatPKR,
  generateWhatsAppMessage,
  createWhatsAppUrl,
  DEFAULT_WHATSAPP_PHONE,
} from "@packages/utils";
import { Product, ProductVariant } from "@packages/types";

interface WhatsAppOrderScreenProps {
  initialProduct?: Product;
  initialVariant?: ProductVariant;
  onBack: () => void;
  onOrderSuccess?: () => void;
}

export const WhatsAppOrderScreen: React.FC<WhatsAppOrderScreenProps> = ({
  initialProduct,
  initialVariant,
  onBack,
  onOrderSuccess,
}) => {
  const { showInfo, dialog } = useInfoDialog();
  const { theme, products } = useMobileStore();

  const [currentProduct, setCurrentProduct] = useState<Product>(
    initialProduct || products[0],
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    initialVariant || currentProduct.variants[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Sargodha");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cities = [
    "Sargodha",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Karachi",
    "Faisalabad",
    "Multan",
    "Peshawar",
  ];

  const handleProductSelect = (p: Product) => {
    setCurrentProduct(p);
    setSelectedVariant(p.variants[0]);
    setShowProductDropdown(false);
  };

  const handleSizeSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    setShowSizeDropdown(false);
  };

  const handleSendOrder = async () => {
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !deliveryAddress.trim()
    ) {
      showInfo(
        "Missing Details",
        "Please fill in your name, phone number, and delivery address.",
      );
      return;
    }

    if (!/^(?:\+?92|0)?3\d{9}$/.test(customerPhone.replace(/[\s()-]/g, ""))) {
      showInfo(
        "Phone Number",
        "Enter a valid Pakistani mobile number, for example 03001234567.",
      );
      return;
    }

    const message = generateWhatsAppMessage({
      productName: currentProduct.name,
      variantWeight: selectedVariant.weight,
      unitPrice: selectedVariant.sale_price || selectedVariant.regular_price,
      quantity,
      customerName,
      customerPhone,
      deliveryCity,
      deliveryAddress,
      isGift,
      giftMessage: isGift ? giftMessage : undefined,
    });

    const url = createWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, message);

    try {
      await Linking.openURL(url);
    } catch {
      showInfo(
        "Could not open WhatsApp",
        "Your order has not been sent. Please try again or contact +92 304 6721962.",
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {dialog}
      <Header
        title="Order on WhatsApp"
        showBack
        onBack={onBack}
        rightAction="none"
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Selected Product Card */}
        <View
          style={[
            styles.previewCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Image
            source={
              currentProduct.name.includes("Energy")
                ? ASSETS.energyBallsCard
                : ASSETS.panjeeriCard
            }
            style={styles.previewImage}
          />

          <View style={styles.previewDetails}>
            <Text style={[styles.previewTitle, { color: theme.text }]}>
              {currentProduct.name}
            </Text>

            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={11} color="#C99B36" />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {currentProduct.rating}{" "}
                <Text style={styles.reviewCount}>
                  ({currentProduct.review_count} reviews)
                </Text>
              </Text>
            </View>

            <Text
              style={[styles.previewWeight, { color: theme.textSecondary }]}
            >
              {selectedVariant.weight}
            </Text>

            <View style={styles.priceRow}>
              <Text style={[styles.salePrice, { color: theme.text }]}>
                {formatPKR(
                  selectedVariant.sale_price || selectedVariant.regular_price,
                )}
              </Text>
              {selectedVariant.sale_price &&
                selectedVariant.sale_price < selectedVariant.regular_price && (
                  <Text style={styles.regularPrice}>
                    {formatPKR(selectedVariant.regular_price)}
                  </Text>
                )}
            </View>
          </View>
        </View>

        {/* Order Form */}
        <View style={styles.formContainer}>
          {/* Select Product Dropdown */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>
              Select Product
            </Text>
            <TouchableOpacity
              onPress={() => setShowProductDropdown(!showProductDropdown)}
              style={[
                styles.dropdownTrigger,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownValue, { color: theme.text }]}>
                {currentProduct.name}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            {showProductDropdown && (
              <View
                style={[
                  styles.dropdownMenu,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                {products.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => handleProductSelect(p)}
                    style={styles.dropdownMenuItem}
                  >
                    <Text
                      style={[styles.dropdownMenuText, { color: theme.text }]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Select Size Dropdown */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>
              Select Size
            </Text>
            <TouchableOpacity
              onPress={() => setShowSizeDropdown(!showSizeDropdown)}
              style={[
                styles.dropdownTrigger,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.dropdownValue, { color: theme.text }]}>
                {selectedVariant.weight} –{" "}
                {formatPKR(
                  selectedVariant.sale_price || selectedVariant.regular_price,
                )}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
            </TouchableOpacity>

            {showSizeDropdown && (
              <View
                style={[
                  styles.dropdownMenu,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                {currentProduct.variants.map((v) => (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => handleSizeSelect(v)}
                    style={styles.dropdownMenuItem}
                  >
                    <Text
                      style={[styles.dropdownMenuText, { color: theme.text }]}
                    >
                      {v.weight} – {formatPKR(v.sale_price || v.regular_price)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Quantity Stepper */}
          <View style={styles.stepperRow}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>
              Quantity
            </Text>
            <View
              style={[
                styles.stepperBox,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.stepBtn}
              >
                <Ionicons name="remove" size={16} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.stepValue, { color: theme.text }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.stepBtn}
              >
                <Ionicons name="add" size={16} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Customer Name */}
          <View style={styles.fieldRow}>
            <Text style={[styles.inlineLabel, { color: theme.text }]}>
              Your Name
            </Text>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              accessibilityLabel="Your name"
              placeholder="Full Name"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.inputBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.fieldRow}>
            <Text style={[styles.inlineLabel, { color: theme.text }]}>
              Phone Number
            </Text>
            <TextInput
              accessibilityLabel="Phone number"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="+92 300 1234567"
              keyboardType="phone-pad"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.inputBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          </View>

          {/* Delivery City */}
          <View style={styles.fieldRow}>
            <Text style={[styles.inlineLabel, { color: theme.text }]}>
              Delivery City
            </Text>
            <TouchableOpacity
              onPress={() => setShowCityDropdown(!showCityDropdown)}
              style={[
                styles.inputBox,
                styles.cityTrigger,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
              activeOpacity={0.8}
            >
              <Text style={{ color: theme.text, fontSize: 13 }}>
                {deliveryCity}
              </Text>
              <Ionicons name="chevron-down" size={14} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {showCityDropdown && (
            <View
              style={[
                styles.dropdownMenu,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  marginLeft: 110,
                },
              ]}
            >
              {cities.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    setDeliveryCity(c);
                    setShowCityDropdown(false);
                  }}
                  style={styles.dropdownMenuItem}
                >
                  <Text
                    style={[styles.dropdownMenuText, { color: theme.text }]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Delivery Address */}
          <View style={styles.fieldRow}>
            <Text style={[styles.inlineLabel, { color: theme.text }]}>
              Delivery Address
            </Text>
            <TextInput
              accessibilityLabel="Delivery address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="House, Street, Area"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.inputBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
            />
          </View>

          {/* Gift Order Toggle */}
          <View style={styles.giftToggleRow}>
            <Text style={[styles.giftLabel, { color: theme.text }]}>
              This is a gift order
            </Text>
            <Switch
              value={isGift}
              onValueChange={setIsGift}
              trackColor={{ false: "#E8DFC8", true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {
            <View style={styles.giftMessageBox}>
              <Text
                style={[styles.giftNoteLabel, { color: theme.textSecondary }]}
              >
                Personalized message for gift (optional)
              </Text>
              <TextInput
                editable={isGift}
                value={giftMessage}
                onChangeText={setGiftMessage}
                placeholder="e.g. Best wishes!"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.giftInput,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
              />
            </View>
          }

          {/* Yellow Info Banner */}
          <View
            style={[
              styles.infoBanner,
              { backgroundColor: theme.goldWarm, borderColor: theme.goldLight },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={theme.gold}
              style={{ marginRight: 8, marginTop: 1 }}
            />
            <Text
              style={[
                styles.infoBannerText,
                { color: theme.mode === "light" ? "#7A5B0B" : "#F1D79E" },
              ]}
            >
              You will be redirected to WhatsApp for final confirmation and
              payment details.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom WhatsApp Button */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          onPress={handleSendOrder}
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
        >
          <FontAwesome
            name="whatsapp"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.sendButtonText}>Send Order on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 16,
  },
  previewImage: {
    width: 95,
    height: 102,
    borderRadius: 14,
    marginRight: 12,
  },
  previewDetails: {
    flex: 1,
  },
  previewTitle: {
    fontFamily: "serif",
    fontSize: 17,
    fontWeight: "700",
  },
  ratingRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  stars: {
    flexDirection: "row",
    marginRight: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
  },
  reviewCount: {
    fontWeight: "400",
    color: "#7A9383",
  },
  previewWeight: {
    fontSize: 12,
    marginVertical: 2,
  },
  priceRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  salePrice: {
    fontSize: 15,
    fontWeight: "800",
  },
  regularPrice: {
    fontSize: 12,
    color: "#8A9E92",
    textDecorationLine: "line-through",
  },
  formContainer: {
    gap: 12,
  },
  fieldGroup: {
    position: "relative",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  dropdownValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  dropdownMenu: {
    marginTop: 6,
    zIndex: 50,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: "hidden",
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E8DFC8",
  },
  dropdownMenuText: {
    fontSize: 13,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  stepperBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 4,
    height: 38,
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: {
    width: 36,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineLabel: {
    width: 110,
    fontSize: 12,
    fontWeight: "700",
  },
  inputBox: {
    flex: 1,
    minWidth: 0,
    fontFamily: "Lato_400Regular",
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  cityTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  giftToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  giftLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  giftMessageBox: {
    marginTop: -4,
  },
  giftNoteLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  giftInput: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginTop: 6,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "500",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 25,
    shadowColor: "#0D5428",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
