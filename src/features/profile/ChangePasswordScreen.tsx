import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { changePassword } from '../../services/firebase/auth';
import { colors } from '../../theme';
import { getFriendlyError } from '../../utils/errors';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../auth/validation/authSchemas';

export function ChangePasswordScreen() {
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus('idle');
    try {
      await changePassword(values.currentPassword, values.newPassword);
      reset();
      setStatus('saved');
    } catch (error) {
      setErrorMessage(getFriendlyError(error));
      setStatus('error');
    }
  });

  return (
    <Screen>
      <AppHeader variant="title" title="Change Password" onBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Controller
            control={control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <Input
                label="Current Password"
                secureTextEntry
                placeholder="••••••••"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                icon={<Lock size={19} color={colors.goldDark} strokeWidth={1.9} />}
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Input
                label="New Password"
                secureTextEntry
                placeholder="At least 6 characters"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                icon={<Lock size={19} color={colors.goldDark} strokeWidth={1.9} />}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Input
                label="Confirm New Password"
                secureTextEntry
                placeholder="Repeat your new password"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                icon={<Lock size={19} color={colors.goldDark} strokeWidth={1.9} />}
              />
            )}
          />

          {status === 'saved' ? (
            <AppText variant="small" color="greenLight" style={styles.status}>
              Password updated.
            </AppText>
          ) : null}
          {status === 'error' ? (
            <AppText variant="small" color="danger" style={styles.status}>
              {errorMessage}
            </AppText>
          ) : null}

          <View style={styles.submit}>
            <Button label="Update Password" variant="green" onPress={onSubmit} loading={isSubmitting} />
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
