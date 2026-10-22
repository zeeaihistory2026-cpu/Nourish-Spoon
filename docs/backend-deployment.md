# Deployment and operations

The customer app and dashboard use Firebase project `nourish-spoon-f4820`. The production dashboard is [nourishspoon-dashboard.vercel.app](https://nourishspoon-dashboard.vercel.app); Android commerce calls its `/api/shop` routes. The Vercel transport provides the shared checkout backend without requiring a Firebase Functions billing upgrade.

## Dashboard

1. Configure the public Firebase web values and private Firebase Admin credentials from `apps/admin/.env.example` in the deployment environment. Both project IDs must match the existing database. Never commit a populated environment file or put Admin credentials in public variables.
2. Configure owner access through `ADMIN_EMAILS` and trusted server-issued claims as described in the [backend contract](../apps/admin/docs/SHARED_BACKEND.md). Delegated staff require verified email and a current User Access record. An editable customer profile never grants administration rights.
3. Run `npm --prefix functions run build`, followed by `node scripts/export-dashboard.mjs tmp/dashboard-release`. This produces the standalone dashboard and its shared server modules. Edit canonical files in `apps/admin`, `functions` or `packages`; do not edit exported `src/server-shared` files.
4. Validate the export with its typecheck/runtime checks and production build, then publish it to the standalone dashboard repository. Vercel runs in `bom1`, near the existing `asia-south1` database.
5. Confirm the deployment succeeds and the public `/api/health` returns the expected project, commerce readiness and schema version. Check an authenticated read after publishing. A local build alone does not prove production is healthy.

Customer apps use Firebase bearer tokens, never dashboard cookies. Web storefronts require an explicit `SHOP_WEB_ORIGINS` allowlist. Production must not contain emulator host variables.

## Database and authentication

Firestore rules live in `firestore.rules`; indexes live in `firestore.indexes.json`. Rule changes are reviewed and tested against isolated emulators before an explicitly authorized production deployment. Do not overwrite live catalogue data or change Firebase billing as part of a routine code cleanup.

Email/password and Android Google Sign-In are supported by the app configuration. Register the Android package and release signing fingerprints in Firebase. Apple sign-in remains hidden unless explicitly configured and verified; do not advertise an unconfigured provider.

The Firebase Hosting provider handoff in `hosting/` retains its expiring, one-use code and verifier safeguards. If the callable transport is deployed separately, it uses the same commerce modules; deployment requirements and billing decisions must be handled explicitly.

## Android build

Provide the Firebase Android client file in ignored `apps/mobile/private-config/google-services.json`. Keep the existing release signing key outside Git. Set JDK 17 and run `scripts/build-android.ps1`; see [the release guide](releases/README.md) for version and signature requirements. The production script rejects demo configuration and fixes the live commerce endpoint.

## Operational checks

- Create orders through the app and verify their canonical IDs, saved totals and appearance in admin Orders.
- Coupons and points are optional. Check both a valid promotion and checkout without discounts.
- Verify payment independently from fulfilment. Tracking may be added after dispatch or delivery.
- Revenue measures paid-order amounts received. Weekly/monthly PDFs and graphs must use the same saved totals; see [receipt/revenue validation](qa/receipts-and-revenue-2026-10-21.md).
- Reviews and optional photos remain pending until dashboard approval. Approved reviews then refresh in the app.
- Check customer inbox records and device notification permission separately. FCM acceptance does not establish visible delivery.
- TCS supplies its own tracking scans through its official page; Nourish Spoon order stages come from the shared order record.

## Isolated QA

Use Node 22 and Java 21 for emulators. Run `npm run check` and `npm run test:integration` from the repository root. QA uses only `demo-nourish-spoon`, `.invalid` accounts and demonstration addresses. Never import those records into production or package emulator settings into an Android release.
