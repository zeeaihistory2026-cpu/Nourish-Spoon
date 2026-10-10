import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { z } from 'zod';

import { AppText } from '../../../components/ui/AppText';
import type { AuthStackParamList } from '../../../app/navigation/navigationTypes';
import { AnalyticsEvent, trackEvent } from '../../../services/analytics/events';
import { signUpEmail } from '../../../services/firebase/auth';
import { BRAND } from '../../../constants';
import { colors } from '../../../theme';
import { getFriendlyError } from '../../../utils/errors';

// Artwork sign-up form schema (terms are accepted via the on-screen link).
const signupArtworkSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Re-enter your password'),
  phone: z
    .union([z.literal(''), z.string().regex(/^(\+?92|0)?\d{10}$/, 'Enter a valid Pakistani mobile number')])
    .optional(),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignUpValues = z.infer<typeof signupArtworkSchema>;

// Sign-up is the brand's exact reference artwork. Invisible native TextInputs
// sit precisely over the five baked field boxes so it stays pixel-identical
// while remaining fully typeable; tap zones cover back, the Create Account
// button and the Sign In link.
export function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const insets = useSafeAreaInsets();
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signupArtworkSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const showFormError = () => {
    const first = formState.errors.fullName?.message
      ?? formState.errors.email?.message
      ?? formState.errors.password?.message
      ?? formState.errors.confirmPassword?.message
      ?? formState.errors.phone?.message;
    setSubmitError(first ?? 'Please check the highlighted fields.');
  };

  // `showFormError` is the onInvalid callback: without it, validation failures
  // are silent and the button appears to do nothing.
  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    setSubmitting(true);
    try {
      await signUpEmail({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
      void trackEvent(AnalyticsEvent.SIGN_UP);
      // RootNavigator switches to the app on auth success.
    } catch (error) {
      setSubmitError(getFriendlyError(error));
      setSubmitting(false);
    }
  }, showFormError);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Image
        pointerEvents="none"
        source={BRAND.fullSignupImage}
        style={styles.artwork}
        contentFit="cover"
        transition={250}
      />

      {/* Back (top-left) */}
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.backZone}
      />

      {/* Transparent inputs over the baked field boxes */}
      <Controller
        control={control}
        name="fullName"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={[styles.input, styles.fullNameInput]}
            autoCapitalize="words"
            placeholder=""
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={[styles.input, styles.fieldInput, styles.emailInput]}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder=""
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={[styles.input, styles.fieldInput, styles.phoneInput]}
            keyboardType="phone-pad"
            placeholder=""
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={[styles.input, styles.fieldInput, styles.passwordInput]}
            secureTextEntry
            placeholder=""
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            style={[styles.input, styles.fieldInput, styles.confirmInput]}
            secureTextEntry
            placeholder=""
          />
        )}
      />

      {/* Create Account button (baked pill) */}
      <Pressable
        onPress={() => void onSubmit()}
        accessibilityRole="button"
        accessibilityLabel="Create Account"
        style={styles.buttonZone}
      />

      {/* Sign In link (bottom) */}
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Sign In"
        style={styles.signInZone}
      />

      {/* Submitting / error overlay — off-canvas of the design, top strip */}
      <View style={[styles.statusStrip, { top: insets.top + 4 }]} pointerEvents="none">
        {submitting ? (
          <AppText style={styles.statusText}>Creating your account…</AppText>
        ) : submitError ? (
          <AppText style={[styles.statusText, { color: colors.danger }]}>{submitError}</AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  backZone: {
    position: 'absolute',
    top: '3.4%',
    left: '6%',
    width: '12%',
    height: '6.5%',
  },
  input: {
    position: 'absolute',
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 14.5,
    paddingTop: 45,
    paddingBottom: 0,
    paddingHorizontal: 0,
    textAlignVertical: 'top',
  },
  fullNameInput: {
    top: '39.4%',
    left: '27%',
    width: '60%',
    height: '4.2%',
  },
  fieldInput: {
    left: '27%',
    width: '60%',
    height: '4.2%',
  },
  emailInput: {
    top: '47.7%',
  },
  phoneInput: {
    top: '56.0%',
  },
  passwordInput: {
    top: '64.4%',
  },
  confirmInput: {
    top: '72.8%',
  },
  buttonZone: {
    position: 'absolute',
    top: '78.6%',
    left: '12%',
    width: '76%',
    height: '5.2%',
  },
  signInZone: {
    position: 'absolute',
    bottom: '3.4%',
    left: '20%',
    width: '60%',
    height: '5%',
  },
  statusStrip: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12.5,
    color: colors.greenMid,
    backgroundColor: 'rgba(253, 246, 227, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
