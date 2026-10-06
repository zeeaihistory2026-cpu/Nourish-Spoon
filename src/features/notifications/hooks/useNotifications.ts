import { useCallback, useEffect, useState } from 'react';

import type { AppNotification } from '../../../types/user';
import type { LoadState } from '../../../types/common';
import { useAuthStore } from '../../../store/authStore';
import { DEMO_MODE } from '../../../demo/demo';
import { fetchNotifications, markNotificationsRead } from '../../profile/services/userService';

export function useNotifications() {
  const uid = useAuthStore((state) => state.user?.uid);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    if (DEMO_MODE) {
      setItems([]);
      setState('ready');
      return;
    }
    if (!uid) {
      setState('ready');
      return;
    }
    setState('loading');
    try {
      setItems(await fetchNotifications(uid));
      setState('ready');
    } catch {
      setState('error');
    }
  }, [uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const markAllRead = useCallback(async () => {
    if (!uid) {
      return;
    }
    try {
      await markNotificationsRead(uid);
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      // Read receipts are best-effort.
    }
  }, [uid]);

  return { items, state, refresh: load, markAllRead };
}
