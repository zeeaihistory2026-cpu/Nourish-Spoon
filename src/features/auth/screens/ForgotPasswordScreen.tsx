import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Screen } from '../../../components/ui/Screen';
import { AppText } from '../../../components/ui/AppText';
import type { AuthStackParamList } from '../../../app/navigation/navigationTypes';
import { AuthHeader } from '../components/AuthHeader';
import { sendPasswordReset } from '../../../services/firebase/auth';
import { colors } from '../../../theme';
import { getFriendlyError } from '../../../utils/errors';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../validation/authSchemas';

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [submitError, setSubmitError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    try {
      await sendPasswordReset(values.email);
      setSentTo(values.email.trim().toLowerCase());
    } catch (error) {
      setSubmitError(getFriendlyError(error));
    }
  });

  return (
    <Screen barStyle="light" edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <AuthHeader />

          <View style={styles.card}>
            <AppText variant="authTitle" color="greenDark">
              Reset Password
            </AppText>
            <AppText variant="smallLight" color="textLight" style={styles.sub}>
              Enter your email and we&apos;ll send you a reset link.
            </AppText>

            {sentTo ? (
              <View style={styles.sentBox}>
                <AppText variant="bodySemibold" color="greenDark" style={styles.sentTitle}>
                  Check your inbox
                </AppText>
                <AppText variant="small" color="textMid" style={styles.sentBody}>
                  If an account exists for {sentTo}, a password reset link is on its way.
                </AppText>
              </View>
            ) : (
              <>
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Email"
                      autoCapitalize="none"
                      autoComplete="email"
                      keyboardType="email-address"
                      placeholder="you@example.com"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                      icon={<Mail size={19} color={colors.goldDark} strokeWidth={1.9} />}
                    />
                  )}
                />
                <View style={styles.submit}>
                  <Button
                    label="Send Reset Link"
                    onPress={onSubmit}
                    variant="green"
                    loading={isSubmitting}
                  />
                </View>
                {submitError ? (
                  <AppText variant="small" color="danger" style={styles.error}>
                    {submitError}
                  </AppText>
                ) : null}
              </>
            )}

            <Pressable style={styles.back} onPress={() => navigation.navigate('Login')} hitSlop={6}>
              <AppText variant="small" color="goldDark">
                Back to Sign In
              </AppText>
            </Pressable>
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
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 26,
    backgroundColor: colors.cream,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -26,
  },
  sub: {
    marginTop: 6,
    marginBottom: 20,
  },
  submit: {
    marginTop: 24,
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
  },
  sentBox: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  sentTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  sentBody: {
    marginTop: 6,
  },
  back: {
    marginTop: 24,
    alignItems: 'center',
  },
});
