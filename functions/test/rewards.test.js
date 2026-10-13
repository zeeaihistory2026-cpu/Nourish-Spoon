const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  savings,
  DEFAULT_PROMO,
  rewardsConfig,
  promoConfig,
} = require("../src/rewardRules");
test("PROMO10 discounts products only and stacks points within the product total", () => {
  assert.deepEqual(savings(2199, DEFAULT_PROMO, 100, 200), {
    promo_discount: 219,
    reward_discount: 100,
    discount: 319,
    points_redeemed: 100,
  });
  assert.equal(rewardsConfig().spend_per_point, 100);
  assert.equal(rewardsConfig().referral_points, 200);
});
test("expired, paused and ineligible promos are rejected", () => {
  for (const coupon of [
    { ...DEFAULT_PROMO, active: false },
    { ...DEFAULT_PROMO, minimum_spend: 5000 },
    { ...DEFAULT_PROMO, expires_at: "2020-01-01T00:00:00Z" },
  ])
    assert.throws(() => savings(2199, coupon));
  assert.equal(
    savings(2199, { ...DEFAULT_PROMO, maximum_discount: 100 }).discount,
    100,
  );
  assert.throws(() => promoConfig({ ...DEFAULT_PROMO, value: 101 }));
});
test("points cannot be fractional, below minimum, beyond wallet balance or exceed products", () => {
  for (const points of [-1, 1.5, 99, 201, NaN])
    assert.throws(() => savings(2199, null, points, 200));
  assert.throws(() => savings(100, DEFAULT_PROMO, 100, 200));
  assert.throws(() =>
    savings(2199, null, 100, 200, { ...rewardsConfig(), enabled: false }),
  );
});
