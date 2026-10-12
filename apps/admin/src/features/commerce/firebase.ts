import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const configured = !!(config.apiKey && config.appId && config.projectId);
const app = configured ? getApps()[0] || initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const database = app ? getFirestore(app) : null;
export const functions = app ? getFunctions(app, "us-central1") : null;
const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST;
if (emulatorHost && auth && database && functions) {
  if (config.projectId !== 'demo-nourish-spoon') throw new Error('Admin emulator previews must use the isolated demo project.');
  connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(database, emulatorHost, 8080);
  connectFunctionsEmulator(functions, emulatorHost, 5001);
}
