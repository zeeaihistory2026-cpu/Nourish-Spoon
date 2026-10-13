import { useCallback, Dispatch, SetStateAction } from "react";
import { create } from "zustand";
type Draft = {
  name: string;
  phone: string;
  city: string;
  line: string;
  delivery: string;
  payment: string;
  gift: boolean;
  giftMessage: string;
  step: number;
  requestId: string;
  promoCode: string;
  rewardPoints: string;
};
const initial = (): Draft => ({
  name: "",
  phone: "",
  city: "",
  line: "",
  delivery: "tcs_nationwide",
  payment: "bank_transfer",
  gift: false,
  giftMessage: "",
  step: 0,
  promoCode: "",
  rewardPoints: "",
  requestId: `${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`,
});
// Memory only: retain checkout across sign-in/instructions, never persist address data to disk.
const useDraft = create<Draft>(initial);
export const clearCheckoutDraft = () => useDraft.setState(initial(), true);
export function useCheckoutField<K extends keyof Draft>(
  key: K,
): [Draft[K], Dispatch<SetStateAction<Draft[K]>>] {
  const value = useDraft((state) => state[key]);
  const setValue = useCallback<Dispatch<SetStateAction<Draft[K]>>>(
    (next) => {
      useDraft.setState(
        (state) =>
          ({
            [key]:
              typeof next === "function"
                ? (next as (previous: Draft[K]) => Draft[K])(state[key])
                : next,
          }) as Partial<Draft>,
      );
    },
    [key],
  );
  return [value, setValue];
}
