import { getApp, type FirebaseApp } from '@react-native-firebase/app';
import { getAuth, type Auth } from '@react-native-firebase/auth';
import { getFirestore, type Firestore } from '@react-native-firebase/firestore';
import { getFunctions, type Functions } from '@react-native-firebase/functions';
import { getStorage, type FirebaseStorage } from '@react-native-firebase/storage';

// The default app is initialized natively from google-services.json /
// GoogleService-Info.plist, so we only ever look it up here.
export const app: FirebaseApp = getApp();

export const firebaseAuth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const cloudFunctions: Functions = getFunctions(app);
export const firebaseStorage: FirebaseStorage = getStorage(app);
