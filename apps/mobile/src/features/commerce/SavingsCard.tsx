import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { CartLine } from "@packages/types/commerce";
import { formatPKR } from "@packages/utils";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Text } from "../../components/DesignPrimitives";
import { useMobileStore } from "../../services/storeService";
import { BUTTON_OUTLINE } from "../../constants/theme";
import { Card, Heading, Copy, Field, Message } from "./components";
import { useCheckoutField } from "./checkoutDraft";
import { call, commerceError } from "./service";
import { useRewardsAccount } from "./rewardsService";
import {
  AppliedSavings,
  SavingsQuote,
  redeemablePoints,
  savingsKey,
  selectedSavings,
} from "./checkoutSavings";

function DiscountAction({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const primary = useMobileStore((state) => state.theme.primary);
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{
        ...BUTTON_OUTLINE,
        minHeight: 44,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: primary,
        justifyContent: "center",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function SavingsCard({
  items,
  delivery,
  applied,
  onQuote,
  onApplying,
  disabled,
}: {
  items: CartLine[];
  delivery: string;
  applied: AppliedSavings | null;
  onQuote: (quote: AppliedSavings | null) => void;
  onApplying: (applying: boolean) => void;
  disabled: boolean;
}) {
  const [promo, setPromo] = useCheckoutField("promoCode");
  const { user, account, loading } = useRewardsAccount();
  const { theme, products } = useMobileStore();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState<SavingsQuote | null>(null);
  const key = savingsKey(items, delivery, user?.uid);
  const currentKey = useRef(key);
  currentKey.current = key;
  const serial = useRef(0);
  const quote = selectedSavings(applied, key);

  useEffect(() => {
    let active = true;
    setOffer(null);
    setMessage("");
    setBusy(false);
    onApplying(false);
    if (user && !user.isAnonymous) {
      // Discovery is optional: slow or unavailable offers never hold up checkout.
      const input = { items, delivery_method: delivery, reward_points: 0 };
      call<SavingsQuote>("quoteOrder", { ...input, promo_code: "PROMO10" })
        .then((result) => {
          if (active && result.promo_discount > 0) setOffer(result);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
      serial.current++;
      onApplying(false);
    };
  }, [key, onApplying]);

  const subtotal = items.reduce((sum, item) => {
    const variant = products
      .find((product) => product.id === item.product_id)
      ?.variants.find((size) => size.id === item.variant_id);
    return (
      sum +
      (variant
        ? (variant.sale_price ?? variant.regular_price) * item.quantity
        : 0)
    );
  }, 0);
  const availablePoints = account
    ? redeemablePoints(
        account.balance,
        subtotal,
        quote?.promo_discount || 0,
        account.config,
      )
    : 0;

  function remove() {
    serial.current++;
    setBusy(false);
    onApplying(false);
    onQuote(null);
    setPromo("");
    setMessage("");
  }

  async function apply(code: string, points: number) {
    if (busy || disabled) return;
    const normalized = code.trim().toUpperCase();
    if (!normalized && !points) {
      remove();
      return;
    }
    if (normalized && !/^[A-Z0-9_-]{4,24}$/.test(normalized)) {
      onQuote(null);
      setMessage(
        "This code is not valid. You can continue without a discount.",
      );
      return;
    }
    const request = ++serial.current;
    const requestedKey = key;
    setBusy(true);
    onApplying(true);
    setMessage("");
    try {
      const result = await call<SavingsQuote>("quoteOrder", {
        items,
        delivery_method: delivery,
        promo_code: normalized,
        reward_points: points,
      });
      if (request !== serial.current || requestedKey !== currentKey.current)
        return;
      onQuote({ key: requestedKey, quote: result });
      setMessage(
        result.discount
          ? `Discount applied: ${formatPKR(result.discount)}.`
          : "No discount applied. You can continue with your order.",
      );
    } catch (error) {
      if (request !== serial.current || requestedKey !== currentKey.current)
        return;
      onQuote(null);
      setMessage(
        `${commerceError(error)} You can continue without a discount.`,
      );
    } finally {
      if (request === serial.current) {
        setBusy(false);
        onApplying(false);
      }
    }
  }

  const actionsDisabled = disabled || busy;
  return (
    <Card>
      <Heading>Offers & Points (optional)</Heading>
      <Copy>Claim a discount if available, or continue with your order.</Copy>
      {offer && quote?.promo_code !== offer.promo_code && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "700" }}>{offer.promo_code}</Text>
            <Copy>Save {formatPKR(offer.promo_discount)} on products</Copy>
          </View>
          <DiscountAction
            label="Claim coupon"
            disabled={actionsDisabled}
            onPress={() => {
              setPromo(offer.promo_code);
              const points = account
                ? redeemablePoints(
                    quote?.points_redeemed || 0,
                    offer.subtotal,
                    offer.promo_discount,
                    account.config,
                  )
                : 0;
              void apply(offer.promo_code, points);
            }}
          />
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Field
            label="Promo code (optional)"
            value={promo}
            onChangeText={setPromo}
            autoCapitalize="characters"
            maxLength={24}
            placeholder="Have another code?"
            editable={!disabled && !busy}
          />
        </View>
        <DiscountAction
          label="Apply code"
          disabled={actionsDisabled || !promo.trim()}
          onPress={() => void apply(promo, quote?.points_redeemed || 0)}
        />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>Reward points</Text>
          <Copy>
            {loading
              ? "Checking available points…"
              : account
                ? `${account.balance} points available${availablePoints ? ` · use ${availablePoints} for ${formatPKR(availablePoints * account.config.point_value)} off` : ""}`
                : "No points selected."}
          </Copy>
          {account && !availablePoints && !quote?.points_redeemed && (
            <Copy>
              {account.config.enabled
                ? `Redeem from ${account.config.minimum_redemption} points when eligible.`
                : "Rewards are currently paused."}
            </Copy>
          )}
        </View>
        {!!availablePoints && !quote?.points_redeemed && (
          <DiscountAction
            label="Claim points"
            disabled={actionsDisabled}
            onPress={() => void apply(quote?.promo_code || "", availablePoints)}
          />
        )}
      </View>
      {!!quote?.discount && (
        <Copy>
          Applied:{" "}
          {[
            quote.promo_discount ? quote.promo_code : "",
            quote.points_redeemed ? `${quote.points_redeemed} points` : "",
          ]
            .filter(Boolean)
            .join(" + ")}
        </Copy>
      )}
      {(!!quote?.discount || busy || !!message) && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Continue without discounts"
          disabled={disabled}
          onPress={remove}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text
            style={{
              color: theme.primary,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            Continue without discounts
          </Text>
        </TouchableOpacity>
      )}
      {busy && <Copy>Applying discount…</Copy>}
      {!!message && <Message>{message}</Message>}
    </Card>
  );
}
