import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { firebaseAuth } from "../services/firebase";
import { installationId } from "../services/pushNotifications";
import { call } from "../features/commerce/service";
import type { AppScreen } from "../navigation/types";

/** Native FCM tokens go directly to our Firebase server, without an Expo push relay. */
export function usePushNotifications(
  uid: string | undefined,
  navigate: (screen: AppScreen) => void,
) {
  useEffect(() => {
    if (!uid || Platform.OS !== "android") return;
    let active = true;
    let dispose = () => {};
    void (async () => {
      const Notifications = await import("expo-notifications");
      if (!active) return;
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      await Notifications.setNotificationChannelAsync("nourish-updates", {
        name: "Nourish Spoon updates",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        lightColor: "#003E31",
      });
      const save = async (token: { type: string; data: unknown }) => {
        if (
          !active ||
          firebaseAuth?.currentUser?.uid !== uid ||
          typeof token.data !== "string"
        )
          return;
        const id = await installationId();
        if (!active || firebaseAuth?.currentUser?.uid !== uid) return;
        await call("registerDevice", {
          installationId: id,
          token: token.data,
          platform: "android",
        });
      };
      const register = async (ask: boolean) => {
        let permission = await Notifications.getPermissionsAsync();
        if (!permission.granted && ask && permission.canAskAgain)
          permission = await Notifications.requestPermissionsAsync();
        if (permission.granted && active)
          await save(await Notifications.getDevicePushTokenAsync());
      };
      const tokenListener = Notifications.addPushTokenListener((token) => {
        void save(token).catch(() => {});
      });
      const responseListener =
        Notifications.addNotificationResponseReceivedListener(() => {
          if (active && firebaseAuth?.currentUser?.uid === uid)
            navigate("Notifications");
        });
      const appState = AppState.addEventListener("change", (state) => {
        if (state === "active") void register(false).catch(() => {});
      });
      dispose = () => {
        tokenListener.remove();
        responseListener.remove();
        appState.remove();
      };
      if (!active) {
        dispose();
        return;
      }
      const previous = Notifications.getLastNotificationResponse();
      if (previous && firebaseAuth?.currentUser?.uid === uid) {
        navigate("Notifications");
        await Notifications.clearLastNotificationResponseAsync();
      }
      await register(true);
    })().catch(() => {});
    return () => {
      active = false;
      dispose();
    };
  }, [uid, navigate]);
}
