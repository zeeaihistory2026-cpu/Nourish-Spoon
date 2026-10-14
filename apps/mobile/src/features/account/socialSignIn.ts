import { nativeGoogleSignIn } from "./nativeGoogle";
import { Platform } from "react-native";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
export async function socialSignIn(provider: "google" | "apple") {
  if (!firebaseAuth) throw new Error("Account services are unavailable.");
  if (Platform.OS === "web") {
    const oauth =
      provider === "google"
        ? new GoogleAuthProvider()
        : new OAuthProvider("apple.com");
    if (provider === "google")
      oauth.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(firebaseAuth, oauth);
    return;
  }
  if (provider === "google") {
    await nativeGoogleSignIn();
    return;
  }
  throw new Error(
    "Apple sign-in is awaiting Apple Developer account setup. Please use Google or email sign-in.",
  );
}
