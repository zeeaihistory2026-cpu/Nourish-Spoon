import { commerceEnabled, rewardsPending } from "./availability";
import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { db } from "../../services/firebase";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { call } from "./service";
export type RewardAccount = {
  referral_program?: { headline: string; copy: string; terms: string };
  balance: number;
  referral_code: string;
  referred_by: string;
  has_delivered_order: boolean;
  config: {
    enabled: boolean;
    spend_per_point: number;
    point_value: number;
    minimum_redemption: number;
    referral_points: number;
    referrals_enabled: boolean;
  };
  history: { id: string; points: number; title: string; created_at: string }[];
};
export function rewardError(error: any) {
  if (
    [
      "functions/not-found",
      "functions/unavailable",
      "functions/internal",
      "permission-denied",
    ].includes(error?.code)
  )
    return "Rewards are unavailable right now. Please try again later.";
  return error?.message || "Could not connect. Please try again.";
}
let cached: { uid: string; account: RewardAccount; at: number } | null = null;
let pending: { uid: string; promise: Promise<RewardAccount> } | null = null;
/** Session-only cache: prefetch at login and share in-flight reads across screens. */
export function preloadRewards(
  uid: string,
  force = false,
): Promise<RewardAccount> {
  if (pending?.uid === uid) return pending.promise;
  if (!force && cached?.uid === uid && Date.now() - cached.at < 30000)
    return Promise.resolve(cached.account);
  const promise = call<RewardAccount>("getRewards", {})
    .then((account) => {
      if (firebaseAuth?.currentUser?.uid === uid)
        cached = { uid, account, at: Date.now() };
      return account;
    })
    .finally(() => {
      if (pending?.promise === promise) pending = null;
    });
  pending = { uid, promise };
  return promise;
}
export function clearRewardsCache() {
  cached = null;
  pending = null;
}
export function useRewardsAccount() {
  const [user, setUser] = useState(firebaseAuth?.currentUser || null);
  const [account, setAccount] = useState<RewardAccount | null>(
      cached && cached.uid === firebaseAuth?.currentUser?.uid
        ? cached.account
        : null,
    ),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const serial = useRef(0);
  useEffect(
    () =>
      firebaseAuth ? onAuthStateChanged(firebaseAuth, setUser) : undefined,
    [],
  );
  const refresh = useCallback(
    async (force = true) => {
      const request = ++serial.current;
      if (!user || user.isAnonymous) {
        setAccount(null);
        setLoading(false);
        return;
      }
      if (!commerceEnabled) {
        setAccount(null);
        setLoading(false);
        setError(rewardsPending);
        return;
      }
      setLoading(!cached || cached.uid !== user.uid);
      setError("");
      try {
        const next = await preloadRewards(user.uid, force);
        if (request === serial.current) setAccount(next);
      } catch (error) {
        if (request === serial.current) setError(rewardError(error));
      } finally {
        if (request === serial.current) setLoading(false);
      }
    },
    [user?.uid],
  );
  useEffect(() => {
    setAccount(cached && cached.uid === user?.uid ? cached.account : null);
    void refresh(false);
    return () => {
      serial.current++;
    };
  }, [refresh]);
  useEffect(() => {
    if (!user || user.isAnonymous || !db || !commerceEnabled) return;
    const fail = (error: unknown) => setError(rewardError(error));
    const stopWallet = onSnapshot(
      doc(db, "rewardWallets", user.uid),
      (snapshot) => {
        if (snapshot.exists())
          setAccount((current) =>
            current ? { ...current, ...snapshot.data() } : current,
          );
      },
      fail,
    );
    const stopHistory = onSnapshot(
      query(
        collection(db, "rewardWallets", user.uid, "history"),
        orderBy("created_at", "desc"),
        limit(30),
      ),
      (snapshot) =>
        setAccount((current) =>
          current
            ? {
                ...current,
                history: snapshot.docs.map(
                  (item) =>
                    ({
                      ...item.data(),
                      id: item.id,
                    }) as RewardAccount["history"][number],
                ),
              }
            : current,
        ),
      fail,
    );
    const stopConfig = onSnapshot(
      doc(db, "settings", "rewards"),
      (snapshot) => {
        if (snapshot.exists())
          setAccount((current) =>
            current
              ? {
                  ...current,
                  config: { ...current.config, ...snapshot.data() },
                }
              : current,
          );
      },
      fail,
    );
    return () => {
      stopWallet();
      stopHistory();
      stopConfig();
    };
  }, [user?.uid]);
  return { user, account, loading, error, refresh };
}
