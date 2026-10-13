import React, { useEffect, useRef, useState } from "react";
import { Card, Heading, Copy, Field, Message } from "./components";
import { GreenButton } from "../../components/DesignPrimitives";
import { useCheckoutField } from "./checkoutDraft";
import { call, commerceError } from "./service";
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
export function SavingsCard({
  items,
  delivery,
  onQuote,
}: {
  items: CartLine[];
  delivery: string;
  onQuote: (quote: SavingsQuote | null) => void;
}) {
  const [promo, setPromo] = useCheckoutField("promoCode"),
    [points, setPoints] = useCheckoutField("rewardPoints");
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const signature = JSON.stringify([items, delivery, promo, points]);
  const current = useRef(signature);
  current.current = signature;
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    onQuote(null);
    setMessage("");
  }, [signature, onQuote]);
  async function apply() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    const requested = signature;
    try {
      const quote = await call<SavingsQuote>("quoteOrder", {
        items,
        delivery_method: delivery,
        promo_code: promo.trim().toUpperCase(),
        reward_points: Number(points || 0),
      });
      if (!mounted.current || current.current !== requested) return;
      onQuote(quote);
      setMessage(
        quote.discount
          ? "Savings applied. Your points are reserved only when you place the order."
          : "No discounts selected.",
      );
    } catch (error) {
      if (!mounted.current || current.current !== requested) return;
      onQuote(null);
      setMessage(commerceError(error));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <Card>
      <Heading>Promo & Points</Heading>
      <Field
        label="Promo code"
        value={promo}
        onChangeText={setPromo}
        autoCapitalize="characters"
        maxLength={24}
        placeholder="e.g. PROMO10"
      />
      <Field
        label="Points to redeem"
        value={points}
        onChangeText={setPoints}
        keyboardType="number-pad"
        maxLength={8}
        placeholder="Minimum 100 points"
      />
      <Copy>
        Points reduce product prices. Delivery charges remain separate.
      </Copy>
      <GreenButton
        title={busy ? "Checking savings…" : "Apply Savings"}
        disabled={busy}
        onPress={apply}
      />
      {!!message && <Message>{message}</Message>}
    </Card>
  );
}
