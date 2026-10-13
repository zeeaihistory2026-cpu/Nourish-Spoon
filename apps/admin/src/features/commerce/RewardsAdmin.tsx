import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { database, functions } from "./firebase";
type Promo = {
  code: string;
  active: boolean;
  type: "percent" | "fixed";
  value: number;
  minimum_spend: number;
  maximum_discount: number | null;
  expires_at: string | null;
};
const defaultPromo: Promo = {
  code: "PROMO10",
  active: true,
  type: "percent",
  value: 10,
  minimum_spend: 0,
  maximum_discount: null,
  expires_at: null,
};
export function RewardsAdmin() {
  const [enabled, setEnabled] = useState(true),
    [spend, setSpend] = useState("100"),
    [value, setValue] = useState("1"),
    [minimum, setMinimum] = useState("100"),
    [referral, setReferral] = useState("200");
  const [promos, setPromos] = useState<Promo[]>([]),
    [draft, setDraft] = useState<Promo>(defaultPromo),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (!database) return;
    const failed = (error: any) =>
      setMessage(error.message || "Could not load reward settings.");
    const settings = onSnapshot(
      doc(database, "settings/rewards"),
      (snapshot) => {
        const p = snapshot.data();
        if (p) {
          setEnabled(p.enabled === true);
          setSpend(String(p.spend_per_point));
          setValue(String(p.point_value));
          setMinimum(String(p.minimum_redemption));
          setReferral(String(p.referral_points));
        }
      },
      failed,
    );
    const coupons = onSnapshot(
      collection(database, "promoCodes"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => doc.data() as Promo);
        setPromos(
          list.some((item) => item.code === "PROMO10")
            ? list
            : [defaultPromo, ...list],
        );
      },
      failed,
    );
    return () => {
      settings();
      coupons();
    };
  }, []);
  async function save(name: string, data: unknown) {
    setBusy(true);
    setMessage("");
    try {
      await httpsCallable(functions!, name)(data);
      setMessage("Saved.");
    } catch (error: any) {
      setMessage(error.message || "Could not save.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <p role="alert">{message}</p>
      <article>
        <h3>Loyalty and referrals</h3>
        <p>
          Only paid, delivered orders earn points. Refunds reverse awarded
          points and restore redeemed points. Referrals apply once, before the
          friend’s first order.
        </p>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          Rewards enabled
        </label>
        <div className="fields">
          <label>
            Product spend for 1 point (PKR)
            <input
              type="number"
              min="1"
              value={spend}
              onChange={(e) => setSpend(e.target.value)}
            />
          </label>
          <label>
            Value of 1 point (PKR)
            <input
              type="number"
              min="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <label>
            Minimum points to redeem
            <input
              type="number"
              min="1"
              value={minimum}
              onChange={(e) => setMinimum(e.target.value)}
            />
          </label>
          <label>
            Referral bonus points
            <input
              type="number"
              min="0"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
            />
          </label>
        </div>
        <button
          disabled={busy}
          onClick={() =>
            save("saveRewardsSettings", {
              enabled,
              spend_per_point: Number(spend),
              point_value: Number(value),
              minimum_redemption: Number(minimum),
              referral_points: Number(referral),
            })
          }
        >
          Save Reward Rules
        </button>
      </article>
      <article>
        <h3>Promo codes</h3>
        <p>
          PROMO10 starts with 10% off products. Delivery is never discounted.
          Edit a code to pause it, set a minimum spend, cap or expiry. Codes
          have no usage limit.
        </p>
        <div className="fields">
          {promos.map((p) => (
            <button
              key={p.code}
              className="secondary"
              onClick={() => setDraft(p)}
            >
              {p.code} · {p.active ? "Active" : "Paused"}
            </button>
          ))}
          <button
            className="secondary"
            onClick={() =>
              setDraft({ ...defaultPromo, code: "", active: false })
            }
          >
            New Code
          </button>
        </div>
        <label>
          Code
          <input
            value={draft.code}
            maxLength={24}
            onChange={(e) =>
              setDraft({ ...draft, code: e.target.value.toUpperCase() })
            }
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
          />{" "}
          Active
        </label>
        <div className="fields">
          <label>
            Discount type
            <select
              value={draft.type}
              onChange={(e) =>
                setDraft({ ...draft, type: e.target.value as Promo["type"] })
              }
            >
              <option value="percent">Percentage</option>
              <option value="fixed">Fixed PKR</option>
            </select>
          </label>
          <label>
            Discount value
            <input
              type="number"
              min="1"
              value={draft.value}
              onChange={(e) =>
                setDraft({ ...draft, value: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Minimum product spend
            <input
              type="number"
              min="0"
              value={draft.minimum_spend}
              onChange={(e) =>
                setDraft({ ...draft, minimum_spend: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Maximum discount (empty = no cap)
            <input
              type="number"
              min="1"
              value={draft.maximum_discount ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  maximum_discount: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </label>
          <label>
            Expiry date (Pakistan, optional)
            <input
              type="date"
              value={draft.expires_at?.slice(0, 10) || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  expires_at: e.target.value
                    ? new Date(e.target.value + "T23:59:59+05:00").toISOString()
                    : null,
                })
              }
            />
          </label>
        </div>
        <button disabled={busy} onClick={() => save("savePromoCode", draft)}>
          Save Promo Code
        </button>
      </article>
    </>
  );
}
