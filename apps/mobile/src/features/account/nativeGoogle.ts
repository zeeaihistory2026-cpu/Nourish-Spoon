import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
export async function nativeGoogleSignIn() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!firebaseAuth || !webClientId)
    throw new Error(
      "Google sign-in is not configured. Please use email sign-in.",
    );
  GoogleSignin.configure({ webClientId, offlineAccess: false });
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Clear the SDK selection so signing back in presents the account picker.
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) throw new Error("Sign-in was cancelled.");
    if (!response.data.idToken)
      throw new Error(
        "Google could not verify this account. Please try again.",
      );
    await signInWithCredential(
      firebaseAuth,
      GoogleAuthProvider.credential(response.data.idToken),
    );
  } catch (error: any) {
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
      throw new Error("Update Google Play services to use Google sign-in.");
    if (error.code === statusCodes.IN_PROGRESS)
      throw new Error("Google sign-in is already open.");
    if (error.code === statusCodes.SIGN_IN_CANCELLED)
      throw new Error("Sign-in was cancelled.");
    throw error;
  }
}
