import { commerceEnabled, rewardsPending } from "./availability";
import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../../services/firebase";
import { call } from "./service";
export type RewardAccount = {
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
export function useRewardsAccount() {
  const [user, setUser] = useState(firebaseAuth?.currentUser || null);
  const [account, setAccount] = useState<RewardAccount | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const serial = useRef(0);
  useEffect(
    () =>
      firebaseAuth ? onAuthStateChanged(firebaseAuth, setUser) : undefined,
    [],
  );
  const refresh = useCallback(async () => {
    const request = ++serial.current;
    if (!user) {
      setAccount(null);
      return;
    }
    if (!commerceEnabled) {
      setAccount(null);
      setLoading(false);
      setError(rewardsPending);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const next = await call<RewardAccount>("getRewards", {});
      if (request === serial.current) setAccount(next);
    } catch (error) {
      if (request === serial.current) setError(rewardError(error));
    } finally {
      if (request === serial.current) setLoading(false);
    }
  }, [user?.uid]);
  useEffect(() => {
    setAccount(null);
    refresh();
    return () => {
      serial.current++;
    };
  }, [refresh]);
  return { user, account, loading, error, refresh };
}
