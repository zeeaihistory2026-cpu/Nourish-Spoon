import { useEffect } from 'react';

import { useAuthStore } from '../../../store/authStore';
import { useSettingsStore } from '../../../store/settingsStore';
import {
  ensureNotificationPermission,
  registerDeviceToken,
  saveDeviceToken,
  subscribeToTokenRefresh,
} from '../../../services/firebase/messaging';

export function usePushNotifications(): void {
  const uid = useAuthStore((state) => state.user?.uid);
  const pushEnabled = useSettingsStore((state) => state.pushEnabled);

  useEffect(() => {
    if (!uid || !pushEnabled) {
      return;
    }
    let cancelled = false;
    void (async () => {
      const granted = await ensureNotificationPermission();
      if (!granted || cancelled) {
        return;
      }
      await registerDeviceToken(uid);
    })();

    const unsubscribe = subscribeToTokenRefresh((token) => {
      void saveDeviceToken(uid, token);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [uid, pushEnabled]);
}
