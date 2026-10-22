import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  firebaseAuth,
  syncPendingCustomerProfile,
  ensureCustomerProfile,
} from "../services/firebase";
import { useMobileStore } from "../services/storeService";
import { clearCheckoutDraft } from "../features/commerce/checkoutDraft";

/** Reconcile account ownership only after both auth and persisted state are ready. */
export function useShoppingSession(onAccountChange: () => void) {
  const [session, setSession] = useState<{
    authReady: boolean;
    user: User | null;
  }>({ authReady: false, user: null });
  useEffect(() => {
    let resolved = !firebaseAuth;
    let accountId: string | null = null;
    let account: User | null = null;
    let previousId = firebaseAuth?.currentUser?.uid || null;
    const syncAccount = () => {
      if (!resolved || !useMobileStore.persist.hasHydrated()) return;
      const store = useMobileStore.getState();
      if (store.shoppingAccountId !== accountId) clearCheckoutDraft();
      store.setShoppingAccount(accountId);
      setSession({ authReady: true, user: account });
    };
    const stopHydration = useMobileStore.persist.onFinishHydration(syncAccount);
    const stopAuth = firebaseAuth
      ? onAuthStateChanged(firebaseAuth, (user) => {
          account = user && !user.isAnonymous ? user : null;
          accountId = account?.uid || null;
          resolved = true;
          if (previousId && previousId !== accountId) {
            clearCheckoutDraft();
            onAccountChange();
          }
          previousId = accountId;
          syncAccount();
          if (account) {
            const current = account;
            syncPendingCustomerProfile(current.uid)
              .then(() => ensureCustomerProfile(current))
              .catch(() => {});
          }
        })
      : undefined;
    syncAccount();
    return () => {
      stopAuth?.();
      stopHydration();
    };
  }, [onAccountChange]);
  return session;
}
