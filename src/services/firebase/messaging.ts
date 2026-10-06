import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import { doc, setDoc } from '@react-native-firebase/firestore';
import { Platform } from 'react-native';

import { db } from './config';
import { serverTimestamp } from './firestore';

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const status = await requestPermission(getMessaging());
    return (
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL
    );
  } catch {
    return false;
  }
}

export async function saveDeviceToken(uid: string, token: string): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'devices', token),
    { token, platform: Platform.OS, createdAt: serverTimestamp() },
    { merge: true }
  );
}

export async function registerDeviceToken(uid: string): Promise<void> {
  try {
    const token = await getToken(getMessaging());
    await saveDeviceToken(uid, token);
  } catch {
    // Push registration can fail on emulators or when Play Services are missing.
  }
}

export function subscribeToTokenRefresh(handler: (token: string) => void): () => void {
  return onTokenRefresh(getMessaging(), handler);
}

export function onForegroundMessage(
  handler: (title: string, body: string) => void
): () => void {
  return onMessage(getMessaging(), (message) => {
    handler(message.notification?.title ?? '', message.notification?.body ?? '');
  });
}
