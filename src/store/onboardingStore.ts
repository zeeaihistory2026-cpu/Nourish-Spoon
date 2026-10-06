import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  completed: boolean;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      completeOnboarding: () => set({ completed: true }),
    }),
    { name: 'ns.onboarding.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);
