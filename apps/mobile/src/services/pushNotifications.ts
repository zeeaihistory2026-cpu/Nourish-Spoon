import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { call } from "../features/commerce/service";

const key = "nourish:installation";
let pendingInstallation: Promise<string> | undefined;
export function installationId(): Promise<string> {
  // Token refresh and initial registration can arrive together on first launch.
  if (!pendingInstallation) {
    pendingInstallation = (async () => {
      const saved = await AsyncStorage.getItem(key);
      if (saved) return saved;
      const id = Crypto.randomUUID();
      await AsyncStorage.setItem(key, id);
      return id;
    })().catch((error) => {
      pendingInstallation = undefined;
      throw error;
    });
  }
  return pendingInstallation;
}

/** Revoke this installation before logout; deleting the native token also works offline. */
export async function unregisterPushNotifications() {
  if (Platform.OS !== "android") return;
  const Notifications = await import("expo-notifications");
  await Promise.allSettled([
    call("unregisterDevice", { installationId: await installationId() }),
    Notifications.unregisterForNotificationsAsync(),
  ]);
}
