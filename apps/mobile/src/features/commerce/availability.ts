// Enable only after the server functions have actually been deployed.
const enabled = process.env.EXPO_PUBLIC_COMMERCE_ENABLED;
export const commerceEnabled =
  enabled !== undefined
    ? enabled === "true"
    : !!process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
export const rewardsPending =
  "Rewards are not activated yet. Points earning, referrals and redemption will start when the program is activated.";
