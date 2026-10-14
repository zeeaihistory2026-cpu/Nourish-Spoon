# Firebase deployment and owner handover

Target project: `nourish-spoon-f4820`. Firestore security rules were compiled and deployed on October 14, 2026, with explicit owner approval. Firebase CLI authorization is configured. Cloud Functions remain undeployed because the owner requested billing stay disabled. The admin dashboard currently runs locally; it has not been published to a public dashboard URL.

Later read-only handover audit on October 14: the live Firestore policy differs from this repository's prepared rules and lacks its admin custom-claim check. The owner can sign in, but data panels show permission warnings. Review the current policy and obtain owner authorization before replacing it, then retest owner access and customer privacy. The earlier successful deployment is not proof that the current live policy still matches the source.

1. Install dependencies in `functions` and `tooling`. Use a Node version supported by Firebase CLI; deployed Functions use Node 22.
2. Sign in using the Google account that owns the Firebase project: `node tooling/node_modules/firebase-tools/lib/bin/firebase.js login`.
3. Review Firebase billing requirements for Cloud Functions. Do not enable or upgrade billing without the owner's decision.
4. Build: `npm --prefix functions run build`. The CLI predeploy hook also generates `functions/lib/normalizeProduct.js` from shared catalogue code.
5. Deploy from the repository root: `node tooling/node_modules/firebase-tools/lib/bin/firebase.js deploy --only firestore,functions,hosting --project nourish-spoon-f4820`. If function discovery times out, set `FUNCTIONS_DISCOVERY_TIMEOUT=60` for this command.
6. Keep Email/Password enabled. Enable Google and verify the Hosting origin is an authorized Firebase Auth domain. Native Google uses the Android Google Sign-In SDK with the configured Firebase web client ID and registered release signing fingerprints.
7. Apple requires an Apple Developer membership, configured Services ID, team/key IDs, private signing key and Firebase Apple provider callback configuration. These have not been supplied. Do not advertise a working Apple account option until an actual provider login passes.
8. The owner-approved Firebase owner account has the server-managed `admin: true` custom claim. Sign in with its account credentials; never store passwords in the repository. The verified `info@nourishspoon.com` fallback remains supported for handover. Grant other owner claims only through a trusted Admin SDK/API with explicit authorization, never an editable profile field.
9. Review existing products in the dashboard before importing anything. Legacy documents are adapted automatically. Use Add Missing Products to import the nine owner-supplied recipe/combo records without overwriting existing products. Review the source screenshots and pack contents before sale. Retain older records for order history; the storefront retires the two generic legacy SKUs. Set real stock, delivery fees and any free-first-order policy; unknown values remain unconfirmed.
10. Test a real owner/customer order through quote, payment confirmation, preparation, dispatch with TCS number, delivery and moderated review. Confirm another customer cannot read it.

Hosting's `/auth.html` uses `/__/firebase/init.json` from the deployed project. Keep its no-store/referrer policy and one-use handoff safeguards. Expired unredeemed `nativeSessions` documents can be removed through a Firestore TTL policy on `expires`; verify the field is a timestamp before enabling TTL.

Before launch, remove the earlier temporary `nourish-profile-qa-…@example.invalid` Auth account and matching user document through the owner console. Previous deployed rules blocked that cleanup. All current commerce QA fixtures use `demo-nourish-spoon` locally and must never be imported into production.

## Local QA

The Firebase CLI requires Java 21+ for its emulators. Start `auth`, `firestore` and `functions` with project `demo-nourish-spoon`, then run:

```sh
npm --prefix functions test
cd tooling
npm run test:rules
node --test commerce.test.mjs
```

`seed-emulator.cjs` seeds only local emulator fixtures, including test delivery fees. Export a separate browser preview with `EXPO_NO_DOTENV=1`, the demo project's public values and `EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1`. Never include that emulator variable in a release. The admin equivalent is `VITE_FIREBASE_EMULATOR_HOST`; it rejects any project other than the demo project.

## Rewards and promos

Prepared defaults approved by the owner: 1 point per Rs.100 of product spend after discounts; Rs.1 per redeemed point; minimum 100 points per redemption; 200 points for the inviter after the friend's first paid and delivered order. Delivery fees do not earn points or receive discounts. PROMO10 gives 10% off products. An explicit paused PROMO10 document overrides its default availability.

Deploy the new callable functions and rules before enabling these features for customers. The owner dashboard's Rewards section manages rates and can create, pause, cap, or expire codes. Wallets and history are server-managed. Checkout validates the coupon and wallet in the order transaction. Paid delivery credits once; cancellation/refund restores redemptions and reverses earnings/referral bonuses once. Reversal may leave a negative balance when earned points were already spent; redemption remains blocked until the balance recovers.

Referrals require a verified email, a different customer's registered code and no prior orders. A customer can apply one code before their first order. Sharing alone never awards points. Local emulator tests cover pricing, duplicate settlement, concurrent redemption, refunds, owner permissions and wallet privacy. Production deployment remains pending.

TCS number entry and the official courier page stay within Android through a WebView. Courier scans are supplied by TCS; this is not a private TCS API integration. Nourish Spoon's order stages are supplied separately by the order backend. A Copy button is retained if the courier changes its form. The browser preview embeds TCS but cannot autofill its cross-origin field.
