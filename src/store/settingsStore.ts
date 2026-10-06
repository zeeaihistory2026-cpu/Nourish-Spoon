import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  pushEnabled: boolean;
  orderUpdates: boolean;
  newsletter: boolean;
  setPreference: (key: 'pushEnabled' | 'orderUpdates' | 'newsletter', value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pushEnabled: true,
      orderUpdates: true,
      newsletter: false,
      setPreference: (key, value) => set({ [key]: value } as Pick<SettingsState, typeof key>),
    }),
    { name: 'ns.settings.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);
