import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown, Minus, Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image } from 'expo-image';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { z } from 'zod';

import type { ProductsStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { WhatsAppCTA } from '../../components/common/WhatsAppCTA';
import { Stars } from '../../components/ui/Stars';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useProduct, useProducts } from '../products/hooks/useProducts';
import { BRAND } from '../../constants';
import { colors, radius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import { openWhatsApp } from '../../utils/whatsapp';

const CITIES = ['Sargodha', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Karachi', 'Other'];

const whatsappOrderSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().regex(/^(\+?92|0)?\d{10}$/, 'Enter a valid Pakistani mobile number'),
  address: z.string().min(5, 'Enter your delivery address'),
  giftMessage: z.string().max(120, 'Please keep it under 120 characters').optional(),
});

type WhatsAppOrderFormData = z.infer<typeof whatsappOrderSchema>;

export function WhatsAppOrderScreen() {
  const route = useRoute<RouteProp<ProductsStackParamList, 'WhatsAppOrder'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const insets = useSafeAreaInsets();
  const { product } = useProduct(route.params.productId);
  const { items: allProducts } = useProducts({});

  const [selectedProductId, setSelectedProductId] = useState(route.params.productId);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const [variantPickerOpen, setVariantPickerOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [city, setCity] = useState('Sargodha');
  const [giftOrder, setGiftOrder] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WhatsAppOrderFormData>({
    resolver: zodResolver(whatsappOrderSchema),
    defaultValues: { name: '', phone: '', address: '', giftMessage: '' },
  });

  const selectedProduct = useMemo(
    () => allProducts.find((entry) => entry.id === selectedProductId) ?? product,
    [allProducts, selectedProductId, product]
  );

  useEffect(() => {
    setVariantIndex(0);
  }, [selectedProductId]);

  const variant = selectedProduct?.variants[variantIndex] ?? null;

  const onSubmit = handleSubmit((values) => {
    if (!selectedProduct || !variant) {
      return;
    }
    const lines = [
      `*New Order â€” ${BRAND.name}*`,
      ``,
      `Product: ${selectedProduct.name}`,
      `Size: ${variant.label}`,
      `Price: ${formatPrice(variant.price)} x ${qty} = ${formatPrice(variant.price * qty)}`,
      ``,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `City: ${city}`,
      `Address: ${values.address.trim()}`,
    ];
    if (giftOrder && values.giftMessage?.trim()) {
      lines.push(`Gift message: ${values.giftMessage.trim()}`);
    }
    void openWhatsApp(lines.join('\n'));
  });

  if (!selectedProduct || !variant) {
    return (
      <Screen>
        <AppHeader variant="title" title="Order on WhatsApp" onBack />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader variant="title" title="Order on WhatsApp" onBack leaves />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 8) + 104 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Image
            source={selectedProduct.images[0] ?? ''}
            style={styles.summaryImage}
            contentFit="cover"
            transition={150}
          />
          <View style={styles.summaryBody}>
            <AppText variant="productTitleSmall" color="greenDark">
              {selectedProduct.name}
            </AppText>
            <View style={styles.ratingRow}>
              <Stars rating={selectedProduct.rating} size={12} />
              <AppText variant="microRegular" color="textMid">
                {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
              </AppText>
            </View>
            <AppText variant="caption" color="textMid">
              {variant.label}
            </AppText>
            <View style={styles.priceRow}>
              <AppText variant="priceValue" color="greenDark">
                {formatPrice(variant.price)}
              </AppText>
              {variant.compareAtPrice ? (
                <AppText variant="caption" color="textLight" style={styles.comparePrice}>
                  {formatPrice(variant.compareAtPrice)}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>

        <FieldLabel>Select Product</FieldLabel>
        <SelectField
          value={selectedProduct.name}
          onPress={() => setProductPickerOpen(true)}
        />

        <FieldLabel>Select Size</FieldLabel>
        <SelectField
          value={`${variant.label} â€“ ${formatPrice(variant.price)}`}
          onPress={() => setVariantPickerOpen(true)}
        />

        <View style={styles.quantityRow}>
          <AppText variant="bodySemibold" color="greenDark">
            Quantity
          </AppText>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setQty((current) => Math.max(1, current - 1))}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
              style={styles.stepperButton}
            >
              <Minus size={17} color={colors.text} strokeWidth={2.2} />
            </Pressable>
            <Text style={styles.stepperValue}>{qty}</Text>
            <Pressable
              onPress={() => setQty((current) => Math.min(99, current + 1))}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
              style={styles.stepperButton}
            >
              <Plus size={17} color={colors.text} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        <FieldLabel>Your Name</FieldLabel>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <View>
              <TextInputBox value={field.value} onChangeText={field.onChange} placeholder="Ali Raza" />
              {errors.name ? <ErrorText message={errors.name.message} /> : null}
            </View>
          )}
        />

        <FieldLabel>Phone Number</FieldLabel>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <View>
              <TextInputBox
                value={field.value}
                onChangeText={field.onChange}
                placeholder="+92 300 1234567"
                keyboardType="phone-pad"
              />
              {errors.phone ? <ErrorText message={errors.phone.message} /> : null}
            </View>
          )}
        />

        <FieldLabel>Delivery City</FieldLabel>
        <SelectField value={city} onPress={() => setCityPickerOpen(true)} />

        <FieldLabel>Delivery Address</FieldLabel>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <View>
              <TextInputBox
                value={field.value}
                onChangeText={field.onChange}
                placeholder="House 12, Street 4, Sargodha"
              />
              {errors.address ? <ErrorText message={errors.address.message} /> : null}
            </View>
          )}
        />

        <View style={styles.giftRow}>
          <AppText variant="bodySemibold" color="greenDark">
            This is a gift order
          </AppText>
          <Switch
            value={giftOrder}
            onValueChange={setGiftOrder}
            trackColor={{ false: colors.toggleOff, true: colors.greenMid }}
            thumbColor={colors.white}
          />
        </View>
        {giftOrder ? (
          <>
            <AppText variant="body" color="textMid">
              Personalized message for gift (optional)
            </AppText>
            <Controller
              control={control}
              name="giftMessage"
              render={({ field }) => (
                <View>
                  <TextInputBox
                    value={field.value ?? ''}
                    onChangeText={field.onChange}
                    placeholder="e.g. Best wishes!"
                  />
                  {errors.giftMessage ? <ErrorText message={errors.giftMessage.message} /> : null}
                </View>
              )}
            />
          </>
        ) : null}

        <View style={styles.infoBanner}>
          <View style={styles.infoIcon}>
            <AppText style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>i</AppText>
          </View>
          <AppText variant="small" color="text" style={styles.infoText}>
            You will be redirected to WhatsApp for final confirmation and payment details.
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) + 10 }]}>
        <WhatsAppCTA label="Send Order on WhatsApp" onPress={onSubmit} />
      </View>

      <Modal transparent visible={productPickerOpen} animationType="fade" onRequestClose={() => setProductPickerOpen(false)}>
        <Pressable style={styles.modalScrim} onPress={() => setProductPickerOpen(false)}>
          <View style={styles.modalCard}>
            <AppText variant="sectionTitle" color="greenDark">
              Select Product
            </AppText>
            {(allProducts.length > 0 ? allProducts : [selectedProduct]).map((entry) => (
              <Pressable
                key={entry.id}
                style={styles.modalRow}
                onPress={() => {
                  setSelectedProductId(entry.id);
                  setProductPickerOpen(false);
                }}
              >
                <AppText variant="body" color="text">
                  {entry.name}
                </AppText>
                {entry.id === selectedProductId ? (
                  <Check size={18} color={colors.greenMid} strokeWidth={2.4} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={variantPickerOpen} animationType="fade" onRequestClose={() => setVariantPickerOpen(false)}>
        <Pressable style={styles.modalScrim} onPress={() => setVariantPickerOpen(false)}>
          <View style={styles.modalCard}>
            <AppText variant="sectionTitle" color="greenDark">
              Select Size
            </AppText>
            {selectedProduct.variants.map((entry, index) => (
              <Pressable
                key={entry.label}
                style={styles.modalRow}
                onPress={() => {
                  setVariantIndex(index);
                  setVariantPickerOpen(false);
                }}
              >
                <AppText variant="body" color="text">
                  {entry.label} â€“ {formatPrice(entry.price)}
                </AppText>
                {index === variantIndex ? (
                  <Check size={18} color={colors.greenMid} strokeWidth={2.4} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={cityPickerOpen} animationType="fade" onRequestClose={() => setCityPickerOpen(false)}>
        <Pressable style={styles.modalScrim} onPress={() => setCityPickerOpen(false)}>
          <View style={styles.modalCard}>
            <AppText variant="sectionTitle" color="greenDark">
              Delivery City
            </AppText>
            {CITIES.map((entry) => (
              <Pressable
                key={entry}
                style={styles.modalRow}
                onPress={() => {
                  setCity(entry);
                  setCityPickerOpen(false);
                }}
              >
                <AppText variant="body" color="text">
                  {entry}
                </AppText>
                {entry === city ? <Check size={18} color={colors.greenMid} strokeWidth={2.4} /> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <AppText variant="bodySemibold" color="greenDark" style={styles.fieldLabel}>
      {children}
    </AppText>
  );
}

function SelectField({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.selectField, pressed && { opacity: 0.85 }]}
    >
      <AppText variant="body" color="text">
        {value}
      </AppText>
      <ChevronDown size={19} color={colors.textLight} strokeWidth={2} />
    </Pressable>
  );
}

function TextInputBox({
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View style={styles.inputBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        style={styles.inputText}
      />
    </View>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <AppText variant="small" color="danger" style={styles.error}>
      {message}
    </AppText>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
  },
  summaryCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 11,
    ...shadows.sm,
  },
  summaryImage: {
    width: 104,
    height: 104,
    borderRadius: radius.md,
    backgroundColor: colors.imageBg,
  },
  summaryBody: {
    flex: 1,
    gap: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 2,
  },
  comparePrice: {
    textDecorationLine: 'line-through',
  },
  fieldLabel: {
    marginTop: 15,
    marginBottom: 7,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 52,
    paddingHorizontal: 15,
  },
  inputBox: {
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 52,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  inputText: {
    color: colors.text,
    fontSize: 14.5,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  stepperButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    width: 46,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  giftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#FBF0D5',
    borderRadius: radius.lg,
    padding: 13,
    marginTop: 16,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    lineHeight: 19,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 10,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.borderHair,
  },
  modalScrim: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.cream,
    borderRadius: radius.xl,
    padding: 18,
    gap: 4,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
  },
  error: {
    marginTop: 5,
  },
});
