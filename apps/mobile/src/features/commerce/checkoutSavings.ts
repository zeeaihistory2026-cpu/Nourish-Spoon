import { CartLine } from "@packages/types/commerce";

export type SavingsQuote = {
  subtotal: number;
  discount: number;
  promo_discount: number;
  reward_discount: number;
  delivery_fee: number | null;
  total: number | null;
  points_redeemed: number;
  promo_code: string;
};
export type AppliedSavings = { key: string; quote: SavingsQuote };

export function savingsKey(items: CartLine[], delivery: string, uid?: string) {
  return JSON.stringify([uid || "", delivery, items]);
}
// Draft input never affects checkout until the customer claims a server quote.
export function selectedSavings(applied: AppliedSavings | null, key: string) {
  return applied?.key === key ? applied.quote : null;
}
export function discountInput(quote: SavingsQuote | null) {
  return { promo_code: quote?.promo_code || "", reward_points: quote?.points_redeemed || 0 };
}
export function redeemablePoints(
  balance: number, subtotal: number, promoDiscount: number,
  config: { enabled: boolean; point_value: number; minimum_redemption: number },
) {
  if (!config.enabled || config.point_value <= 0) return 0;
  const points = Math.min(balance, Math.floor(Math.max(0, subtotal - promoDiscount) / config.point_value));
  return Number.isSafeInteger(points) && points >= config.minimum_redemption ? points : 0;
}
