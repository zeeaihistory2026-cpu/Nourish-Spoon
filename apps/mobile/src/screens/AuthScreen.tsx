import { useInfoDialog } from "../components/InfoDialog";
import React, { useState, useRef } from "react";
import {
  Image,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Botanical,
  Brand,
  GreenButton,
} from "../components/DesignPrimitives";
import { useMobileStore } from "../services/storeService";
import {
  firebaseAuth,
  isFirebaseConfigured,
  saveCustomerProfile,
  accountError,
} from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { AuthInput } from "../components/AuthInput";
import { validateAccount } from "../features/account/validateAccount";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { socialSignIn } from "../features/account/socialSignIn";

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
  const { width } = useWindowDimensions();
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationTick, setValidationTick] = useState(0);
  const reduceMotion = useReducedMotion();
  const invalid = (key: string) => ({
    error: errors[key],
    validationTick,
    reduceMotion,
  });
  const configured = () => {
    if (!isFirebaseConfigured) {
      setMessage(
        "Account services are not configured yet. You can still browse the products.",
      );
      return false;
    }
    return true;
  };
  const submit = async () => {
    if (busy) return;
    setMessage("");
    const invalidFields = validateAccount(signup, {
      email,
      password,
      name,
      phone,
      confirm,
    });
    setErrors(invalidFields);
    if (Object.keys(invalidFields).length) {
      setValidationTick((value) => value + 1);
      setMessage("Check the highlighted fields.");
      return;
    }
    if (!configured()) return;
    setBusy(true);
    try {
      if (signup) {
        const { user } = await createUserWithEmailAndPassword(
          firebaseAuth!,
          email.trim().toLowerCase(),
          password,
        );
        await updateProfile(user, { displayName: name.trim() });
        // Profile synchronization must not block a successfully created account.
        saveCustomerProfile(
          user.uid,
          name.trim(),
          email.trim().toLowerCase(),
          phone.trim(),
        ).catch(() => {});
      } else {
        await signInWithEmailAndPassword(
          firebaseAuth!,
          email.trim().toLowerCase(),
          password,
        );
      }
      onSuccess();
    } catch (error: any) {
      setMessage(accountError(error));
    } finally {
      setBusy(false);
    }
  };
  const reset = async () => {
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors((previous) => ({
        ...previous,
        email: email.trim()
          ? "Enter a valid email address."
          : "Enter your email address.",
      }));
      setValidationTick((value) => value + 1);
      emailRef.current?.focus();
      setMessage("");
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
  const social = async (provider: "google" | "apple") => {
    if (busy || !configured()) return;
    setBusy(true);
    setMessage("");
    try {
      await socialSignIn(provider);
      onSuccess();
    } catch (error: any) {
      setMessage(
        error.code
          ? accountError(error)
          : error.message || "Could not complete sign-in.",
      );
    } finally {
      setBusy(false);
    }
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
              {...invalid("name")}
              label="Full Name"
              icon="person-outline"
              showLabel
              value={name}
              onChangeText={(value) => {
                setName(value);
                setErrors((previous) => ({ ...previous, name: "" }));
              }}
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
            {...invalid("email")}
            label="Email Address"
            icon="mail-outline"
            showLabel={signup}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrors((previous) => ({ ...previous, email: "" }));
            }}
            placeholder={signup ? "Enter your email address" : "Email Address"}
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
              {...invalid("phone")}
              label="Phone Number"
              icon="call-outline"
              showLabel
              value={phone}
              onChangeText={(value) => {
                setPhone(value);
                setErrors((previous) => ({ ...previous, phone: "" }));
              }}
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
            {...invalid("password")}
            label="Password"
            icon="lock-closed-outline"
            showLabel={signup}
            password
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((previous) => ({ ...previous, password: "" }));
            }}
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
              {...invalid("confirm")}
              label="Confirm Password"
              icon="lock-closed-outline"
              showLabel
              password
              value={confirm}
              onChangeText={(value) => {
                setConfirm(value);
                setErrors((previous) => ({ ...previous, confirm: "" }));
              }}
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
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              disabled={busy}
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
          <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
            {(["google", "apple"] as const).map((provider) => (
              <TouchableOpacity
                key={provider}
                accessibilityRole="button"
                accessibilityLabel={`Continue with ${provider === "google" ? "Google" : "Apple"}`}
                disabled={busy}
                onPress={() => social(provider)}
                style={{
                  flex: 1,
                  minHeight: 48,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: 10,
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 8,
                  opacity: busy ? 0.6 : 1,
                }}
              >
                {provider === "google" ? (
                  <Image
                    source={require("../../assets/icons/google-signin.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons name="logo-apple" size={21} color="#000000" />
                )}
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 14, color: "#183320" }}
                >
                  {provider === "google" ? "Google" : "Apple"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={signup ? "Go to sign in" : "Go to sign up"}
            disabled={busy}
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
            accessibilityRole="button"
            accessibilityLabel="Browse products"
            onPress={onBack}
            style={{ alignItems: "center", paddingBottom: 12 }}
          >
            <Text style={{ color: c.primary, fontSize: 12 }}>
              Browse products
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
