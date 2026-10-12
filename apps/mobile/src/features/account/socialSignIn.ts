import { Platform } from "react-native";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithCustomToken,
} from "firebase/auth";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { firebaseAuth } from "../../services/firebase";
import { call } from "../commerce/service";
WebBrowser.maybeCompleteAuthSession();
export async function socialSignIn(provider: "google" | "apple") {
  if (!firebaseAuth) throw new Error("Account services are unavailable.");
  if (Platform.OS === "web") {
    const oauth =
      provider === "google"
        ? new GoogleAuthProvider()
        : new OAuthProvider("apple.com");
    await signInWithPopup(firebaseAuth, oauth);
    return;
  }
  const bytes = await Crypto.getRandomBytesAsync(32);
  const verifier = Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
  const challenge = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
  );
  const state = Crypto.randomUUID();
  const redirect = "nourishspoon://auth";
  const bridge = `https://${firebaseAuth.app.options.projectId}.web.app/auth.html`;
  const availability = await fetch(bridge);
  if (!availability.ok)
    throw new Error(
      `${provider === "google" ? "Google" : "Apple"} sign-in setup is awaiting Firebase deployment. Please use email sign-in for now.`,
    );
  const result = await WebBrowser.openAuthSessionAsync(
    `${bridge}?provider=${provider}&challenge=${challenge}&state=${state}`,
    redirect,
  );
  if (result.type !== "success") throw new Error("Sign-in was cancelled.");
  const url = new URL(result.url);
  if (
    url.protocol !== "nourishspoon:" ||
    url.hostname !== "auth" ||
    url.searchParams.get("state") !== state
  )
    throw new Error("Sign-in could not be verified. Please try again.");
  const code = url.searchParams.get("code");
  if (!code) throw new Error("Sign-in did not complete. Please try again.");
  const { token } = await call<{ token: string }>("redeemNativeSession", {
    code,
    verifier,
  });
  await signInWithCustomToken(firebaseAuth, token);
}
