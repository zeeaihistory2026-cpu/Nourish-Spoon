import { useEffect, type ReactNode } from 'react';

import { observeAuth, watchUserProfile } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';

/**
 * Subscribes to Firebase Auth and mirrors the session into `useAuthStore`
 * (the single source of truth). There is no local state here by design —
 * every consumer reads from the store via `useAuth()` or `useAuthStore`
 * selectors, so the session can never drift between two copies.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const unsubscribe = observeAuth((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        clearAuth();
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, [setUser, setInitializing, clearAuth]);

  const uid = useAuthStore((state) => state.user?.uid);
  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }
    const unsubscribe = watchUserProfile(uid, (next) => {
      setProfile(next);
    });
    return unsubscribe;
  }, [uid, setProfile]);

  return <>{children}</>;
}

/**
 * Convenience selector for the auth session. Equivalent to reading
 * `useAuthStore` directly; kept so existing call sites don't churn.
 */
export function useAuth() {
  const initializing = useAuthStore((state) => state.initializing);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  return { initializing, user, profile };
}
