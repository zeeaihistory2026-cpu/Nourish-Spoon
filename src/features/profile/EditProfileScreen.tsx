import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../store/authStore';
import { saveProfile } from './services/userService';
import { colors } from '../../theme';
import { getFriendlyError } from '../../utils/errors';

const editProfileSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  phone: z.union([
    z.literal(''),
    z.string().regex(/^(\+?92|0)?\d{10}$/, 'Enter a valid Pakistani mobile number'),
  ]),
  city: z.string(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export function EditProfileScreen() {
  const uid = useAuthStore((state) => state.user?.uid ?? null);
  const profile = useAuthStore((state) => state.profile);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: profile?.fullName ?? '',
      phone: profile?.phone ?? '',
      city: profile?.city ?? '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName ?? '',
        phone: profile.phone ?? '',
        city: profile.city ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!uid) {
      return;
    }
    setStatus('idle');
    try {
      await saveProfile(uid, {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
      });
      setStatus('saved');
    } catch (error) {
      setErrorMessage(getFriendlyError(error));
      setStatus('error');
    }
  });

  return (
    <Screen>
      <AppHeader variant="title" title="Edit Profile" onBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Input
            label="Email"
            value={profile?.email ?? ''}
            editable={false}
            icon={null}
          />
          <Controller
            control={control}
            name="fullName"
            render={({ field, fieldState }) => (
              <Input
                label="Full Name"
                autoCapitalize="words"
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
                label="Phone (WhatsApp)"
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
            name="city"
            render={({ field }) => (
              <Input
                label="City"
                autoCapitalize="words"
                placeholder="Lahore"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />

          {status === 'saved' ? (
            <AppText variant="small" color="greenMid" style={styles.status}>
              Profile saved.
            </AppText>
          ) : null}
          {status === 'error' ? (
            <AppText variant="small" color="danger" style={styles.status}>
              {errorMessage}
            </AppText>
          ) : null}

          <View style={styles.submit}>
            <Button
              label="Save Changes"
              variant="green"
              onPress={onSubmit}
              loading={isSubmitting}
              disabled={!isDirty}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  status: {
    marginTop: 14,
    textAlign: 'center',
  },
  submit: {
    marginTop: 22,
  },
});
