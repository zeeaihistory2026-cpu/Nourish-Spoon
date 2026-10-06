import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../app/navigation/navigationTypes';
import { AnalyticsEvent, trackEvent } from '../../../services/analytics/events';
import { signInEmail } from '../../../services/firebase/auth';
import { BRAND } from '../../../constants';
import { colors } from '../../../theme';
import { getFriendlyError } from '../../../utils/errors';
import { loginSchema, type LoginFormData } from '../validation/authSchemas';

const REMEMBERED_EMAIL_KEY = 'ns.rememberedEmail';

// Login is the brand's exact reference artwork. Invisible native TextInputs
// sit over the two baked field boxes (email, password) so it stays
// pixel-identical while remaining fully typeable; tap zones cover back,
// Forgot Password, Sign In, the social buttons and the Sign Up link.
export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const insets = useSafeAreaInsets();
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    void AsyncStorage.getItem(REMEMBERED_EMAIL_KEY).then((saved) => {
      if (saved) {
        setValue('email', saved);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit(async (values: LoginFormData) => {
    setSubmitError('');
    setSubmitting(true);
    try {
      await signInEmail(values.email, values.password);
      await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, values.email.trim().toLowerCase());
      void trackEvent(AnalyticsEvent.LOGIN);
      // RootNavigator switches to the app on auth success.
    } catch (error) {
      setSubmitError(getFriendlyError(error));
      setSubmitting(false);
    }
  });

  const showFormError = () => {
    const first = formState.errors.email?.message ?? formState.errors.password?.message;
    setSubmitError(first ?? 'Please check your email and password.');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Image
        source={BRAND.fullLoginImage}
        style={[styles.artwork, { marginTop: insets.top }]}
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

      {/* Email field — transparent input over the baked box */}
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <View style={[styles.inputPatch, styles.emailPatch]}>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder=""
              style={styles.inputText}
            />
          </View>
        )}
      />

      {/* Password field — transparent input over the baked box */}
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <View style={[styles.inputPatch, styles.passwordPatch]}>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              placeholder=""
              style={styles.inputText}
            />
          </View>
        )}
      />

      {/* Forgot Password (right-aligned under password) */}
      <Pressable
        onPress={() => navigation.navigate('ForgotPassword')}
        accessibilityRole="button"
        accessibilityLabel="Forgot Password"
        style={styles.forgotZone}
      />

      {/* Sign In button (baked pill) */}
      <Pressable
        onPress={() => void onSubmit()}
        accessibilityRole="button"
        accessibilityLabel="Sign In"
        style={styles.signInZone}
      />

      {/* Continue with Google */}
      <Pressable
        onPress={() => setSubmitError('Google sign-in is coming soon. Use your email for now.')}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
        style={styles.googleZone}
      />

      {/* Continue with Apple */}
      <Pressable
        onPress={() => setSubmitError('Apple sign-in is coming soon. Use your email for now.')}
        accessibilityRole="button"
        accessibilityLabel="Continue with Apple"
        style={styles.appleZone}
      />

      {/* Don't have an account? Sign Up */}
      <Pressable
        onPress={() => navigation.navigate('SignUp')}
        accessibilityRole="button"
        accessibilityLabel="Sign Up"
        style={styles.signUpZone}
      />

      {/* Submitting / error strip — sits over the cream top area */}
      <View style={[styles.statusStrip, { top: insets.top + 4 }]} pointerEvents="none">
        {submitting ? (
          <AppText style={styles.statusText}>Signing you in…</AppText>
        ) : submitError ? (
          <AppText style={[styles.statusText, { color: colors.danger }]}>{submitError}</AppText>
        ) : null}
      </View>
    </View>
  );
}

import { AppText } from '../../../components/ui/AppText';

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
    top: '6.7%',
    left: '5.1%',
    width: '11.2%',
    height: '5.5%',
  },
  inputPatch: {
    position: 'absolute',
    backgroundColor: '#FBF5E6',
    justifyContent: 'center',
  },
  emailPatch: {
    top: '41%',
    left: '15.5%',
    width: '69%',
    height: '4.8%',
  },
  passwordPatch: {
    top: '49.9%',
    left: '15.5%',
    width: '66%',
    height: '4.8%',
  },
  inputText: {
    color: colors.text,
    fontSize: 14.5,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  forgotZone: {
    position: 'absolute',
    top: '56.6%',
    left: '54%',
    width: '34%',
    height: '3.8%',
  },
  signInZone: {
    position: 'absolute',
    top: '59.9%',
    left: '9.9%',
    width: '80.2%',
    height: '5.8%',
  },
  googleZone: {
    position: 'absolute',
    top: '72.4%',
    left: '9.1%',
    width: '39.6%',
    height: '4.4%',
  },
  appleZone: {
    position: 'absolute',
    top: '72.4%',
    left: '51.2%',
    width: '39.6%',
    height: '4.4%',
  },
  signUpZone: {
    position: 'absolute',
    top: '80.8%',
    left: '20%',
    width: '60%',
    height: '3.8%',
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
