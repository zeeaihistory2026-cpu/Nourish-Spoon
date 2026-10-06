import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@react-native-firebase/auth';

import { observeAuth, watchUserProfile } from '../../services/firebase/auth';
import { useAuthStore } from '../../store/authStore';
import type { UserProfile } from '../../types';

interface AuthContextValue {
  initializing: boolean;
  user: User | null;
  profile: UserProfile | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const setStoreUser = useAuthStore((state) => state.setUser);
  const setStoreProfile = useAuthStore((state) => state.setProfile);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const unsubscribe = observeAuth((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setStoreUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        clearAuth();
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, [setStoreUser, clearAuth]);

  const uid = user?.uid;
  useEffect(() => {
    if (!uid) {
      setProfileState(null);
      setStoreProfile(null);
      return;
    }
    const unsubscribe = watchUserProfile(uid, (next) => {
      setProfileState(next);
      setStoreProfile(next);
    });
    return unsubscribe;
  }, [uid, setStoreProfile]);

  const value = useMemo(
    () => ({ initializing, user, profile }),
    [initializing, user, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
