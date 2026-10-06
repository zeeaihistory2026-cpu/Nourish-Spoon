import type { User } from '@react-native-firebase/auth';
import { create } from 'zustand';

import type { UserProfile } from '../types';

interface AuthState {
  /** Firebase user; null when signed out. Single source of truth — do not duplicate. */
  user: User | null;
  profile: UserProfile | null;
  initializing: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setInitializing: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  initializing: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setInitializing: (initializing) => set({ initializing }),
  clearAuth: () => set({ user: null, profile: null }),
}));
