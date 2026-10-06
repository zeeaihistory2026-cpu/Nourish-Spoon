import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Plus, Trash2 } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../store/authStore';
import { deleteAddress, fetchAddresses, saveAddress } from './services/userService';
import { addressSchema, type AddressFormData } from '../checkout/validation/checkoutSchema';
import { colors, radius, shadows } from '../../theme';
import { getFriendlyError } from '../../utils/errors';
import type { Address } from '../../types';

export function AddressesScreen() {
  const uid = useAuthStore((state) => state.user?.uid ?? null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [formOpen, setFormOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: '', fullName: '', phone: '', line1: '', city: '' },
  });

  const load = useCallback(async () => {
    if (!uid) {
      return;
    }
    setState('loading');
    try {
      setAddresses(await fetchAddresses(uid));
      setState('ready');
    } catch {
      setState('error');
    }
  }, [uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = handleSubmit(async (values) => {
    if (!uid) {
      return;
    }
    try {
      await saveAddress(uid, {
        label: values.label.trim(),
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        line1: values.line1.trim(),
        city: values.city.trim(),
        isDefault: addresses.length === 0,
      });
      reset();
      setFormOpen(false);
      await load();
    } catch (error) {
      Alert.alert('Could not save address', getFriendlyError(error));
    }
  });

  const onDelete = (address: Address) => {
    if (!uid) {
      return;
    }
    Alert.alert('Delete address', `Remove "${address.label}" from your delivery locations?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await deleteAddress(uid, address.id);
              await load();
            } catch (error) {
              Alert.alert('Could not delete address', getFriendlyError(error));
            }
          })();
        },
      },
    ]);
  };

  const onSetDefault = (address: Address) => {
    if (!uid || address.isDefault) {
      return;
    }
    void (async () => {
      try {
        await saveAddress(uid, { ...address, isDefault: true });
        await load();
      } catch (error) {
        Alert.alert('Could not update address', getFriendlyError(error));
      }
    })();
  };

  return (
    <Screen>
      <AppHeader variant="title" title="Delivery Locations" onBack />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {state === 'loading' ? (
          <AppText variant="small" color="textLight">
            Loading addresses…
          </AppText>
        ) : state === 'error' ? (
          <EmptyState
            icon={<MapPin size={30} color={colors.goldDark} strokeWidth={1.8} />}
            title="Couldn't load addresses"
            message="Please check your connection and try again."
            actionLabel="Retry"
            onAction={() => void load()}
          />
        ) : addresses.length === 0 && !formOpen ? (
          <EmptyState
            icon={<MapPin size={30} color={colors.goldDark} strokeWidth={1.8} />}
            title="No saved addresses"
            message="Save a delivery location to speed up checkout."
            actionLabel="Add Address"
            onAction={() => setFormOpen(true)}
          />
        ) : (
          <>
            {addresses.map((address) => (
              <View key={address.id} style={styles.card}>
                <Pressable style={styles.cardBody} onPress={() => onSetDefault(address)}>
                  <View style={styles.icon}>
                    <MapPin size={18} color={colors.goldDark} strokeWidth={2} />
                  </View>
                  <View style={styles.body}>
                    <AppText variant="cardTitle" color="text">
                      {address.label}
                      {address.isDefault ? (
                        <AppText variant="micro" color="greenMid">
                          {' '}
                          · Default
                        </AppText>
                      ) : null}
                    </AppText>
                    <AppText variant="small" color="textLight">
                      {address.fullName} · {address.phone}
                    </AppText>
                    <AppText variant="small" color="textLight">
                      {address.line1}, {address.city}
                    </AppText>
                    {!address.isDefault ? (
                      <AppText variant="micro" color="goldDark" style={styles.setDefault}>
                        Tap to make default
                      </AppText>
                    ) : null}
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => onDelete(address)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${address.label} address`}
                  hitSlop={6}
                >
                  <Trash2 size={16} color={colors.chevron} strokeWidth={2} />
                </Pressable>
              </View>
            ))}

            <Pressable style={styles.addToggle} onPress={() => setFormOpen((open) => !open)}>
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
                <View style={styles.save}>
                  <Button label="Save Address" variant="green" onPress={onSave} loading={isSubmitting} />
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 13,
    marginTop: 12,
    ...shadows.sm,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flex: 1,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  setDefault: {
    marginTop: 4,
  },
  addToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  form: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 12,
  },
  save: {
    marginTop: 6,
  },
});
