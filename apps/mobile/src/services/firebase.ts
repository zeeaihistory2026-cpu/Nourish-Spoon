import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  Auth,
  browserLocalPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import * as AuthSDK from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
};
export const isFirebaseConfigured = !!(
  config.apiKey &&
  config.projectId &&
  config.appId
);
const app = isFirebaseConfigured ? getApps()[0] || initializeApp(config) : null;
export const db = app ? getFirestore(app) : null;
export const firebaseAuth: Auth | null = app
  ? (() => {
      try {
        // The React Native bundle exports this helper; the browser bundle does not.
        const nativePersistence = (
          AuthSDK as typeof AuthSDK & {
            getReactNativePersistence: (storage: typeof AsyncStorage) => any;
          }
        ).getReactNativePersistence;
        return initializeAuth(app, {
          persistence:
            Platform.OS === "web"
              ? browserLocalPersistence
              : nativePersistence(AsyncStorage),
        });
      } catch (error: any) {
        if (error.code === "auth/already-initialized") return getAuth(app);
        throw error;
      }
    })()
  : null;
// Explicit local QA configuration; release exports must leave this variable unset.
const emulatorHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
if (emulatorHost && db && firebaseAuth && app) {
  connectAuthEmulator(firebaseAuth, `http://${emulatorHost}:9099`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, emulatorHost, 8080);
  connectFunctionsEmulator(
    getFunctions(app, "us-central1"),
    emulatorHost,
    5001,
  );
}

export async function saveCustomerProfile(
  uid: string,
  fullName: string,
  email: string,
  phone?: string,
) {
  if (!db) throw new Error("Firebase is not configured.");
  const key = `nourish:profile:${uid}`;
  const previous = await AsyncStorage.getItem(key);
  const pending = previous ? JSON.parse(previous) : {};
  const profile = {
    ...pending,
    fullName,
    email,
    ...(phone !== undefined ? { phone } : {}),
  };
  const saved = JSON.stringify(profile);
  await AsyncStorage.setItem(key, saved);
  await setDoc(
    doc(db, "users", uid),
    { uid, ...profile, role: "customer", updatedAt: serverTimestamp() },
    { merge: true },
  );
  // A completed older write must not remove a newer pending edit.
  if ((await AsyncStorage.getItem(key)) === saved)
    await AsyncStorage.removeItem(key);
}
export async function syncPendingCustomerProfile(uid: string) {
  const saved = await AsyncStorage.getItem(`nourish:profile:${uid}`);
  if (saved) {
    const profile = JSON.parse(saved);
    await saveCustomerProfile(
      uid,
      profile.fullName,
      profile.email,
      profile.phone,
    );
  }
}
export function accountError(error: { code?: string; message?: string }) {
  const messages: Record<string, string> = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/email-already-in-use":
      "An account already exists for this email. Please sign in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password":
      "Choose a stronger password with at least 8 characters.",
    "auth/too-many-requests":
      "Too many attempts. Please wait before trying again.",
    "auth/network-request-failed":
      "Could not connect. Check your internet connection and try again.",
    "auth/operation-not-allowed":
      "This sign-in method needs to be enabled in Firebase.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
  };
  return (
    messages[error.code || ""] ||
    "Could not complete sign-in. Please try again."
  );
}
