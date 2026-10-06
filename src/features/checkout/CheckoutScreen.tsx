import { zodResolver } from '@hookform/resolvers/zod';
import { Banknote, ChevronRight, CreditCard, Landmark, MapPin, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomBar } from '../../components/common/BottomBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SumCard } from '../../components/common/SumCard';
import { PACKAGE_ICON } from '../../components/common/icons';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { cartTotals, useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { DEMO_ADDRESS, DEMO_MODE, useDemoStore } from '../../demo/demo';
import { trackPurchase } from '../../services/analytics/events';
import { placeOrderClientSide } from '../orders/services/orderService';
import { fetchAddresses, saveAddress } from '../profile/services/userService';
import { colors, radius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import { getFriendlyError } from '../../utils/errors';
import type { Address, PaymentMethod } from '../../types';
import { addressSchema, type AddressFormData } from './validation/checkoutSchema';

export function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useCartStore((store) => store.items);
  const clearCart = useCartStore((store) => store.clear);
  const uid = useAuthStore((store) => store.user?.uid ?? null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const totals = useMemo(() => cartTotals(items), [items]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: '', fullName: '', phone: '', line1: '', city: '' },
  });

  const loadAddresses = useCallback(async () => {
    if (DEMO_MODE) {
      // Demo mode keeps a single built-in address; nothing is fetched.
      setAddresses([{ ...DEMO_ADDRESS, id: 'demo-address', isDefault: true }]);
      setSelectedId('demo-address');
      setAddressError(false);
      setLoadingAddresses(false);
      return;
    }
    if (!uid) {
      return;
    }
    setLoadingAddresses(true);
    setAddressError(false);
    try {
      const list = await fetchAddresses(uid);
      setAddresses(list);
      setSelectedId(
        (current) =>
          current ?? list.find((address) => address.isDefault)?.id ?? list[0]?.id ?? null
      );
    } catch {
      setAddressError(true);
    } finally {
      setLoadingAddresses(false);
    }
  }, [uid]);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const selectedAddress = addresses.find((address) => address.id === selectedId) ?? null;

  const onAddAddress = handleSubmit(async (values) => {
    if (!uid) {
      return;
    }
    try {
      const id = await saveAddress(uid, {
        label: values.label.trim(),
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        line1: values.line1.trim(),
        city: values.city.trim(),
        isDefault: addresses.length === 0,
      });
      setFormOpen(false);
      reset();
      const list = await fetchAddresses(uid);
      setAddresses(list);
      setSelectedId(id);
    } catch (error) {
      Alert.alert('Could not save address', getFriendlyError(error));
    }
  });

  const onPlaceOrder = async () => {
    if (!selectedAddress) {
      setSubmitError('Please add a delivery address first.');
      return;
    }
    setSubmitError('');
    setPlacing(true);
    try {
      let order: { orderId: string; orderNumber: string; total: number };
      if (DEMO_MODE) {
        // Demo mode stores the order on the phone.
        const placed = useDemoStore
          .getState()
          .addOrder(
            items.map((item) => ({
              productId: item.productId,
              name: item.name,
              weight: item.variantLabel,
              image: item.image,
              price: item.price,
              qty: item.qty,
            })),
            paymentMethod,
            { subtotal: totals.subtotal, deliveryFee: totals.deliveryFee, total: totals.total }
          );
        order = { orderId: placed.id, orderNumber: placed.orderNumber, total: placed.total };
      } else {
        if (!uid) {
          setSubmitError('Please sign in before placing an order.');
          setPlacing(false);
          return;
        }
        // TEMPORARY client-side ordering until the server function is deployed.
        order = await placeOrderClientSide(
          uid,
          items.map((item) => ({
            productId: item.productId,
            variantLabel: item.variantLabel,
            qty: item.qty,
          })),
          {
            label: selectedAddress.label,
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            line1: selectedAddress.line1,
            city: selectedAddress.city,
          },
          paymentMethod
        );
      }
      clearCart();
      trackPurchase(order.orderId, order.total);
      navigation.dispatch(StackActions.replace('OrderSuccess', order));
    } catch (error) {
      setSubmitError(getFriendlyError(error));
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placing) {
    return (
      <Screen>
        <AppHeader variant="title" title="Checkout" onBack />
        <EmptyState
          icon={PACKAGE_ICON}
          title="Your cart is empty"
          message="Add something delicious before checking out."
          actionLabel="Browse Products"
          onAction={() => navigation.dispatch(StackActions.popToTop())}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader variant="title" title="Checkout" onBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SectionHeader title="Delivery Address" />
        {loadingAddresses ? (
          <AppText variant="small" color="textLight">
            Loading addresses…
          </AppText>
        ) : addressError ? (
          <EmptyState
            icon={<MapPin size={30} color={colors.goldDark} strokeWidth={1.8} />}
            title="Couldn't load addresses"
            message="Please check your connection and try again."
            actionLabel="Retry"
            onAction={() => void loadAddresses()}
          />
        ) : (
          <>
            {addresses.map((address) => {
              const selected = address.id === selectedId;
              return (
                <Pressable
                  key={address.id}
                  onPress={() => setSelectedId(address.id)}
                  style={[styles.addressCard, selected && styles.addressCardOn]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <View style={styles.addressIcon}>
                    <MapPin size={18} color={colors.goldDark} strokeWidth={2} />
                  </View>
                  <View style={styles.addressBody}>
                    <AppText variant="cardTitle" color="text" numberOfLines={1}>
                      {address.label} — {address.fullName}
                    </AppText>
                    <AppText variant="small" color="textLight">
                      {address.line1}, {address.city} · {address.phone}
                    </AppText>
                  </View>
                  <ChevronRight size={16} color={colors.chevron} strokeWidth={2} />
                </Pressable>
              );
            })}

            <Pressable style={styles.addAddress} onPress={() => setFormOpen((open) => !open)}>
              <Plus size={16} color={colors.greenMid} strokeWidth={2.2} />
              <AppText variant="captionMedium" color="greenMid">
                {formOpen ? 'Hide form' : 'Add New Address'}
              </AppText>
            </Pressable>

            {formOpen ? (
              <View style={styles.form}>
                <Controller
                  control={control}
                  name="label"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Label"
                      placeholder="Home"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Recipient Name"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Phone"
                      keyboardType="phone-pad"
                      placeholder="+92 300 0000000"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="line1"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Street Address"
                      placeholder="House 12, Street 4, DHA Phase 5"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="city"
                  render={({ field, fieldState }) => (
                    <Input
                      label="City"
                      placeholder="Lahore"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <View style={styles.saveAddress}>
                  <Button
                    label="Save Address"
                    variant="outline"
                    height={46}
                    onPress={onAddAddress}
                    loading={isSubmitting}
                  />
                </View>
              </View>
            ) : null}
          </>
        )}

        <SectionHeader title="Payment Method" />
        <PaymentOption
          label="Cash on Delivery"
          selected={paymentMethod === 'cod'}
          onSelect={() => setPaymentMethod('cod')}
          icon={<Banknote size={19} color={colors.greenMid} strokeWidth={2} />}
        />
        <PaymentOption
          label="Bank Transfer"
          selected={paymentMethod === 'bank_transfer'}
          onSelect={() => setPaymentMethod('bank_transfer')}
          icon={<Landmark size={19} color={colors.textLight} strokeWidth={2} />}
        />
        <PaymentOption
          label="Credit / Debit Card"
          selected={false}
          disabled
          onSelect={() => undefined}
          note="Coming soon"
          icon={<CreditCard size={19} color={colors.textLight} strokeWidth={2} />}
        />

        <SumCard subtotal={totals.subtotal} deliveryFee={totals.deliveryFee} />

        {submitError ? (
          <AppText variant="small" color="danger" style={styles.error}>
            {submitError}
          </AppText>
        ) : null}
      </ScrollView>
      </KeyboardAvoidingView>

      <BottomBar>
        <View style={styles.total}>
          <AppText variant="small" color="textLight">
            Total payable
          </AppText>
          <AppText variant="stat" color="greenDark">
            {formatPrice(totals.total)}
          </AppText>
        </View>
        <View style={styles.placeButton}>
          <Button
            label="Place Order"
            variant="green"
            height={48}
            onPress={() => void onPlaceOrder()}
            loading={placing}
          />
        </View>
      </BottomBar>
    </Screen>
  );
}

function PaymentOption({
  label,
  selected,
  onSelect,
  icon,
  note,
  disabled,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon: ReactNode;
  note?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: Boolean(disabled) }}
      style={[styles.payOption, selected && styles.payOptionOn, disabled && styles.payOptionDisabled]}
    >
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <AppText
        variant="cardTitle"
        style={{ color: disabled ? colors.textLight : selected ? colors.greenDark : colors.textMid }}
      >
        {label}
      </AppText>
      {note ? (
        <AppText variant="micro" color="goldDark" style={styles.note}>
          {note}
        </AppText>
      ) : null}
      <View style={styles.payIcon}>{icon}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 13,
    marginTop: 4,
    ...shadows.sm,
  },
  addressCardOn: {
    borderColor: colors.greenMid,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBody: {
    flex: 1,
  },
  addAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 10,
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingHorizontal: 4,
  },
  form: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 12,
  },
  saveAddress: {
    marginTop: 6,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 13,
    marginTop: 10,
  },
  payOptionOn: {
    borderColor: colors.greenMid,
  },
  payOptionDisabled: {
    opacity: 0.75,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.checkbox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: colors.greenMid,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.greenMid,
  },
  note: {
    marginLeft: 6,
  },
  payIcon: {
    marginLeft: 'auto',
  },
  error: {
    marginTop: 14,
    textAlign: 'center',
  },
  total: {
    flex: 1,
  },
  placeButton: {
    flex: 1.2,
  },
});
