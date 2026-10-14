import { getApp, type FirebaseApp } from '@react-native-firebase/app';
import { getAuth, type Auth } from '@react-native-firebase/auth';
import { getFirestore, type Firestore } from '@react-native-firebase/firestore';
import { getFunctions, type Functions } from '@react-native-firebase/functions';
import { getStorage, type FirebaseStorage } from '@react-native-firebase/storage';

// The default app is initialized natively from google-services.json /
// GoogleService-Info.plist, so we only ever look it up here. The web build has
// no native config and therefore no default app; it runs in demo mode only, so
// we must not throw at import time or the whole bundle fails to start.
function lookupDefaultApp(): FirebaseApp | null {
  try {
    return getApp();
  } catch {
    return null;
  }
}

const defaultApp = lookupDefaultApp();

/** False when no Firebase app is configured for this platform (e.g. web). */
export const firebaseAvailable = defaultApp !== null;

// When Firebase is unavailable these handles are never initialized; every
// caller is either gated on demo mode or on `firebaseAvailable`.
export const app = defaultApp as FirebaseApp;
export const firebaseAuth = (defaultApp ? getAuth(defaultApp) : null) as Auth;
export const db = (defaultApp ? getFirestore(defaultApp) : null) as Firestore;
export const cloudFunctions = (defaultApp ? getFunctions(defaultApp) : null) as Functions;
export const firebaseStorage = (defaultApp ? getStorage(defaultApp) : null) as FirebaseStorage;
