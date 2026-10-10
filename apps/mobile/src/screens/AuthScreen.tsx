import { useInfoDialog } from "../components/InfoDialog";
import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  Text,
  Botanical,
  Brand,
  ART,
  GreenButton,
} from "../components/DesignPrimitives";
import { useMobileStore } from "../services/storeService";
import { firebaseAuth, isFirebaseConfigured, saveCustomerProfile, accountError } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { AuthInput } from "../components/AuthInput";

WebBrowser.maybeCompleteAuthSession();
export function AuthScreen({
  signup = false,
  onBack,
  onSwitch,
  onSuccess,
}: {
  signup?: boolean;
  onBack: () => void;
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const { showInfo, dialog } = useInfoDialog();
  const { theme: c } = useMobileStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const configured = () => {
    if (!isFirebaseConfigured) {
      setMessage(
        "Account services are not configured yet. You can still browse and order as a guest.",
      );
      return false;
    }
    return true;
  };
  const submit = async () => {
    setMessage("");
    if (
      !email.trim() ||
      !password ||
      (signup && (!name.trim() || !phone.trim()))
    ) {
      setMessage("Please complete all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (signup && !/^(?:\+?92|0)?3\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
      setMessage("Please enter a valid Pakistani mobile number.");
      return;
    }
    if (signup && (password.length < 8 || password !== confirm)) {
      setMessage(
        "Use at least 8 characters and make sure both passwords match.",
      );
      return;
    }
    if (!configured()) return;
    setBusy(true);
    try {
      if (signup) {
        const { user } = await createUserWithEmailAndPassword(firebaseAuth!, email.trim().toLowerCase(), password);
        await updateProfile(user, { displayName: name.trim() });
        try { await saveCustomerProfile(user.uid, name.trim(), email.trim().toLowerCase(), phone.trim()); }
        catch { /* Firebase Auth retains the name and email; profile sync can be retried later. */ }
      } else {
        await signInWithEmailAndPassword(firebaseAuth!, email.trim().toLowerCase(), password);
      }
      onSuccess();
    } catch (error: any) {
      setMessage(accountError(error));
    } finally {
      setBusy(false);
    }
  };
  const reset = async () => {
    if (!email.includes("@")) {
      setMessage(
        "Enter your email address above to receive a password reset link.",
      );
      return;
    }
    if (!configured()) return;
    setBusy(true);
    try {
      await sendPasswordResetEmail(firebaseAuth!, email.trim().toLowerCase());
      setMessage("Check your email for a password reset link.");
    } catch (e: any) {
      setMessage(accountError(e));
    } finally {
      setBusy(false);
    }
  };
  const [googleRequest, , promptGoogle] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'unconfigured',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'unconfigured',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'unconfigured',
  });
  const oauth = async (provider: 'google' | 'apple') => {
    if (!configured()) return;
    setBusy(true); setMessage('');
    try {
      if (Platform.OS === 'web') {
        await signInWithPopup(firebaseAuth!, provider === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com'));
      } else if (provider === 'google') {
        const clientId = Platform.OS === 'android' ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID : process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
        if (!clientId || !googleRequest) { setMessage('Google sign-in is being configured. Please use email and password.'); return; }
        const result = await promptGoogle();
        if (result.type !== 'success') return;
        const idToken = result.params.id_token || result.authentication?.idToken;
        const accessToken = result.authentication?.accessToken;
        if (!idToken && !accessToken) throw new Error('Missing Google credential');
        await signInWithCredential(firebaseAuth!, GoogleAuthProvider.credential(idToken, accessToken));
      } else {
        setMessage('Apple sign-in is available in the web app. Please use email and password on Android.'); return;
      }
      onSuccess();
    } catch (error: any) { setMessage(accountError(error)); } finally { setBusy(false); }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: c.background }}
    >
      {dialog}
      <Botanical full />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 16, flexGrow: 1 }}
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          onPress={onBack}
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            backgroundColor: c.surface,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Ionicons name="chevron-back" size={25} color={c.primary} />
        </TouchableOpacity>
        <Brand large />
        <Text
          style={{
            fontFamily: "serif",
            fontWeight: "700",
            textAlign: "center",
            color: c.primary,
            fontSize: signup ? 25 : 32,
            marginTop: 25,
            marginBottom: 9,
          }}
        >
          {signup ? "Create Your Account" : "Welcome Back"}
        </Text>
        <Text
          style={{
            color: c.textSecondary,
            textAlign: "center",
            fontSize: 14,
            lineHeight: 20,
            paddingHorizontal: 36,
            marginBottom: 18,
          }}
        >
          {signup
            ? "Join Nourish Spoon and start your journey towards healthier, happier tomorrows."
            : "Sign in to continue your journey towards a healthier, happier you."}
        </Text>
        <View style={{ paddingHorizontal: signup ? 32 : 24 }}>
          {signup && (
            <AuthInput
              label="Full Name"
              icon="person-outline"
              showLabel
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          )}
          <AuthInput
            ref={emailRef}
            label={signup ? "Email Address" : "Email Address"}
            icon="mail-outline"
            showLabel={signup}
            value={email}
            onChangeText={setEmail}
            placeholder={
              signup ? "Enter your email address" : "Email Address"
            }
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() =>
              signup ? phoneRef.current?.focus() : passwordRef.current?.focus()
            }
          />
          {signup && (
            <AuthInput
              ref={phoneRef}
              label="Phone Number"
              icon="call-outline"
              showLabel
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          )}
          <AuthInput
            ref={passwordRef}
            label="Password"
            icon="lock-closed-outline"
            showLabel={signup}
            password
            value={password}
            onChangeText={setPassword}
            placeholder={signup ? "Create a password" : "Password"}
            autoCapitalize="none"
            autoComplete={signup ? "new-password" : "current-password"}
            textContentType={signup ? "newPassword" : "password"}
            returnKeyType={signup ? "next" : "go"}
            onSubmitEditing={() =>
              signup ? confirmRef.current?.focus() : submit()
            }
          />
          {signup && (
            <AuthInput
              ref={confirmRef}
              label="Confirm Password"
              icon="lock-closed-outline"
              showLabel
              password
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Re-enter your password"
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={submit}
            />
          )}
          {!signup && (
            <TouchableOpacity
              onPress={reset}
              style={{ alignSelf: "flex-end", paddingBottom: 14 }}
            >
              <Text
                style={{ color: c.primary, textDecorationLine: "underline" }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}
          {!!message && (
            <Text
              accessibilityRole="alert"
              style={{
                color: c.text,
                fontSize: 13,
                lineHeight: 19,
                marginBottom: 12,
              }}
            >
              {message}
            </Text>
          )}
          <GreenButton
            title={
              busy ? "Please wait…" : signup ? "Create Account" : "Sign In"
            }
            onPress={submit}
            disabled={busy}
          />
          {!signup && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginVertical: 18,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: c.border }}
                />
                <Text style={{ color: c.textSecondary }}>or continue with</Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: c.border }}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {(["google", "apple"] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    disabled={busy}
                    onPress={() => oauth(p)}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      borderRadius: 24,
                      borderWidth: 1,
                      borderColor: c.border,
                      backgroundColor: c.surface,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FontAwesome
                      name={p === "google" ? "google" : "apple"}
                      size={21}
                      color={p === "google" ? "#4285F4" : c.text}
                    />
                    <Text style={{ color: c.text, fontSize: 11 }}>
                      Continue with {p === "google" ? "Google" : "Apple"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {signup && (
            <Text
              style={{
                fontSize: 11,
                lineHeight: 17,
                color: c.textSecondary,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              By creating an account, you agree to our{"\n"}
              <Text
                onPress={() =>
                  showInfo(
                    "Terms & Privacy",
                    "Please contact info@nourishspoon.com for the current terms and privacy policy.",
                  )
                }
                style={{ color: c.primary, textDecorationLine: "underline" }}
              >
                Terms & Conditions and Privacy Policy.
              </Text>
            </Text>
          )}
          <TouchableOpacity
            onPress={onSwitch}
            style={{ alignItems: "center", paddingVertical: 18 }}
          >
            <Text style={{ fontSize: 13, color: c.textSecondary }}>
              {signup ? "Already have an account? " : "Don’t have an account? "}
              <Text
                style={{
                  color: c.primary,
                  fontWeight: "700",
                  textDecorationLine: "underline",
                }}
              >
                {signup ? "Sign In" : "Sign Up"}
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onBack}
            style={{ alignItems: "center", paddingBottom: 12 }}
          >
            <Text style={{ color: c.primary, fontSize: 12 }}>
              Continue as guest
            </Text>
          </TouchableOpacity>
        </View>
        <Image
          source={ART.login}
          style={{ width: "100%", aspectRatio: 2.76 }}
          resizeMode="cover"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
