# Nourish Spoon

Nourish Spoon contains the Expo customer app, the interactive Next.js admin dashboard and the shared Firebase commerce backend. Both apps use the same Firebase project and canonical order, catalogue, promo and reward records.

## Structure

- `apps/mobile/src/application`: app startup, session handling and screen composition.
- `apps/mobile/src/screens` and `features`: storefront, account and commerce screens.
- `apps/mobile/src/components`: shared UI; `plugins` contains repeatable native launch configuration.
- `apps/admin/src/app`: dashboard pages and authenticated API routes.
- `apps/admin/src/components` and `lib`: dashboard UI, access control and database adapters.
- `functions/src`: shared transactional checkout, fulfilment, rewards, reviews and native authentication handoff.
- `packages/catalog`, `commerce`, `types`, `utils`: shared catalogue normalization, delivery calculations and contracts.
- `tooling`: isolated database rules and integration tests.
- `docs`: indexed architecture, deployment, original design references and release history.
- `scripts`: repository/asset audits, Android release build and repeatable dashboard export.
- `tooling/artwork` and `tooling/previews`: optional authoring utilities, separate from runtime code.

Environment files, signing keys, generated builds, deployment checkouts and recovery archives are excluded from Git. Source assets and original design references are retained; confirmed unused assets are removed with a recovery manifest.

## Development and checks

Use Node 22. Run `npm ci` separately in `apps/mobile`, `apps/admin`, `functions` and `tooling`. Configure each app from its `.env.example`. Never put server credentials in `EXPO_PUBLIC_*` or `NEXT_PUBLIC_*` variables.

Start the customer app with `npm --prefix apps/mobile start`, and the dashboard with `npm --prefix apps/admin run dev`.

- `npm run check`: repository hygiene, strict TypeScript, asset references, business tests, Firebase runtime compatibility and the dashboard production build.
- `npm run audit:repo`: reject installers, private credentials and generated output in source control; verify native template and version consistency.
- `npm --prefix apps/mobile run build:web`: customer web export.
- `npm run test:integration`: isolated Auth, Firestore, callable and dashboard API checks; requires Java 21 and available emulator ports. This refuses to use the production database.

See the [documentation index](docs/README.md), [shared backend contract](apps/admin/docs/SHARED_BACKEND.md) and [cleanup audit](docs/qa/repository-cleanup-2026-10-21.md).

## Commerce contract

Prices and stock are read from Firestore on the server. A stable checkout request ID prevents duplicate orders and stock reservations. Coupons and points are optional. `PROMO10` applies a 10% discount to products; dashboard-managed codes use the same validation. Shipping is Rs. 250 when the product total after discounts is at most Rs. 2,500, and free above Rs. 2,500. Pickup is free.

Orders use `pending`, `confirmed`, `preparing`, `out_for_delivery`, `delivered` and `cancelled`. Payments are manually verified bank or wallet transfers. The dashboard does not claim automatic payment-gateway verification. Tracking is optional for dispatch and delivery; a valid TCS consignment number can be added later without reopening the order. Customers receive live order and inbox updates through owner-scoped Firestore listeners. Dashboard announcements also reach every customer inbox and registered Android devices through FCM, subject to phone notification permission.

Referral codes link verified new customers before their first order. Referral points are awarded once after a paid delivery, with refunds reversing the ledger entries. Dashboard program settings and customer checkout share `settings/rewards`.

Customer photos and reviews become public after dashboard approval. Downloadable receipts show the saved order amount and payment state; PAID appears only for a verified paid order. Revenue and weekly/monthly PDF reports count money received from paid orders, independently of delivery status, using saved totals and Pakistan calendar boundaries.

## Release and deployment

The version 1 release displays `1.0.0`. The current Android build number is defined in `apps/mobile/app.json` and must match the native Gradle configuration. Keep `com.nourishspoon.app` and the existing release signing key to preserve update compatibility and app data. Future builds must continue increasing `versionCode` even when the display version is unchanged.

For native push builds, place the Firebase Android client configuration for `com.nourishspoon.app` in ignored `apps/mobile/private-config/google-services.json`. The release script generates the native client resources; no Firebase Admin private key belongs in the APK. Set `JAVA_HOME` to the Android JDK and run `scripts/build-android.ps1`.

The canonical dashboard source is `apps/admin`. After `npm --prefix functions run build`, run `node scripts/export-dashboard.mjs tmp/dashboard-release` to generate a standalone Vercel checkout. The exporter replaces generated source trees and preserves Git metadata and ignored environment files. Generated `src/server-shared` modules must not be edited directly.

The production dashboard and Android commerce URL are `https://nourishspoon-dashboard.vercel.app` and its `/api/shop` endpoint. Confirm the deployed `/api/health` schema version and test authenticated reads after publishing. Local verification does not by itself confirm a production deployment.

Use [GitHub Releases](https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/latest) for the current APK and handover documents. Installers never belong in the source tree. See [release retention and signing](docs/releases/README.md) before publishing an update.
