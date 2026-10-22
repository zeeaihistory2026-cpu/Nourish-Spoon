# Separate dashboard integration review — 16 October 2026

Reviewed [nourishspoon-dashboard](https://github.com/zeeaihistory2026-cpu/nourishspoon-dashboard) at commit `2cae22865be4c8596bbe1df9b8aad2bb68e8ae3a`, its configured [Vercel deployment](https://nourishspoon-dashboard.vercel.app), and the customer app/backend in this workspace on `codex/design-alignment`, including the local cleanup changes.

**Result: the separate dashboard is a real Next.js application with Firebase Admin integration code, but it is not compatible with this workspace's complete commerce contract. Its live backend operation could not be confirmed.** Sharing Firebase infrastructure alone does not establish working feature integration. No production records, credentials, permissions, deployments or source code were changed during this review.

## Findings

### P1 — Dashboard order queries and updates use a different contract

The dashboard [order list](https://github.com/zeeaihistory2026-cpu/nourishspoon-dashboard/blob/2cae22865be4c8596bbe1df9b8aad2bb68e8ae3a/src/app/api/admin/orders/route.ts#L29) orders by `createdAt`, while this app/backend writes `created_at`. Its order detail/update route reads `userId` and writes `orderStatus`/`paymentStatus`; this app reads `customer_uid`, `status` and `payment_status`. The dashboard uses `placed → packed`, while this app supports `pending → confirmed → preparing` before delivery.

Canonical orders without `createdAt` are excluded from the dashboard query. Writing the dashboard's status fields would not update the app's order state. The separate dashboard also writes orders directly through Admin SDK instead of this backend's `updateOrder` transaction, bypassing the canonical inventory restoration, reward settlement/reversal and status-history logic.

Use one shared contract and the authoritative order mutation path, with explicit adaptation for older documents. Verify list visibility, payment changes, cancellation stock restoration and rewards together in an isolated integration test.

### P1 — Tracking and order updates contain invalid Firestore transforms

The [order update route](https://github.com/zeeaihistory2026-cpu/nourishspoon-dashboard/blob/2cae22865be4c8596bbe1df9b8aad2bb68e8ae3a/src/app/api/admin/orders/%5Bid%5D/route.ts#L87) puts `FieldValue.serverTimestamp()` inside a milestone array. Tracking creation and milestone updates repeat the pattern, including an array-union element. Firestore rejects these values; the combined order/tracking batch therefore cannot complete successfully.

A local, network-free check using the installed Google Cloud Firestore SDK reproduced: `FieldValue.serverTimestamp() cannot be used inside of an array`. This check validates the payload shape; it did not call a live database.

Use a concrete timestamp for array elements, or individual event documents with top-level server timestamps. Keep stage validation and writes in a transaction to avoid concurrent stale-stage updates.

### P1 — Email allowlist grants admin privileges without verified email

The [session route](https://github.com/zeeaihistory2026-cpu/nourishspoon-dashboard/blob/2cae22865be4c8596bbe1df9b8aad2bb68e8ae3a/src/app/api/auth/session/route.ts#L16) accepts an allowlisted email and can grant `admin: true` without checking `decoded.email_verified`. `requireAdmin` also accepts the email allowlist without verification. If an allowlisted address has no established Firebase account, an unverified account claiming that address can receive administrator access. No exploit or account creation was attempted.

Require verified ownership before granting privileges through an email allowlist, or provision admin claims through a trusted owner workflow. Preserve existing custom claims when adding an admin claim.

### P1 — Soft-deleting canonical products may leave them available in the app

The dashboard's [CRUD delete handler](https://github.com/zeeaihistory2026-cpu/nourishspoon-dashboard/blob/2cae22865be4c8596bbe1df9b8aad2bb68e8ae3a/src/lib/crud-factory.ts) sets `isActive=false` and `deletedAt`. This app's catalogue normalizer prioritizes the existing canonical `active` field over `isActive` and does not inspect `deletedAt`.

A local fixture with `active=true` and the dashboard's deletion fields remained active after running the actual app normalizer. The product can therefore disappear from the dashboard while remaining available in the app. Align deletion and availability fields, and preserve historical order snapshots.

### P1 — Several dashboard modules write locations the current app does not consume

| Feature | Separate dashboard | Current workspace app/backend |
| --- | --- | --- |
| Review moderation | `visibility` | `status`: `pending`, `approved`, `hidden` |
| Coupons | `coupons` | `promoCodes` through protected functions |
| Reward balance | `users/{uid}.points` | `rewardWallets/{uid}` |
| Notification inbox | top-level `notifications`, `recipientUid` | `users/{uid}/notifications`, `created_at` |
| Wishlist | `users/{uid}/wishlist` | account-scoped local persisted favourites |
| Tracking | `tracking` collection | order fields/status history and TCS lookup |
| Editable app content | `appContent`, `appConfig`, content collections | bundled home/story/FAQ/onboarding/payment content |

Changing these dashboard controls will not reliably change the corresponding feature in this workspace app. The dashboard integration document references a different customer-app layout and content service; that is not evidence of integration with this branch. Select the intended customer-app version, then align both codebases and rules against one documented contract. Do not deploy the dashboard's example rules over the current policy without reviewing the resulting customer access and order-write permissions.

### P2 — Concurrent point adjustments can lose updates

The [points adjustment endpoint](https://github.com/zeeaihistory2026-cpu/nourishspoon-dashboard/blob/2cae22865be4c8596bbe1df9b8aad2bb68e8ae3a/src/app/api/admin/points/adjust/route.ts#L14) reads the balance before a write batch and later writes an absolute result. Two requests reading the same balance can overwrite one another, despite both ledger records being written. Use a transaction with the canonical reward wallet and an idempotency key rather than a separate balance system.

## Live deployment observations

Read-only HTTP checks on 16 October 2026 returned:

| Path | HTTP status |
| --- | --- |
| `/` | 500 |
| `/login` | 200; sign-in form renders |
| `/api/admin/orders` without credentials | 500 |
| `/api/admin/products` without credentials | 500 |
| `/api/diag` | 404 |

The deployed site may not match the reviewed GitHub commit; deployment identity and private environment configuration were not available. These responses do not establish the cause of the errors or successful Firebase connectivity. An unauthenticated API request should normally receive a deliberate authentication response rather than a server error.

## Verification limits and next work

- The separate source was downloaded to `tmp/dashboard-integration-review` without switching or merging the current app branch.
- Static route/schema review and local SDK/normalizer reproductions were completed. The separate Next.js project was not installed, built or executed locally. The existing Vite `apps/admin` project built successfully; this does not validate the separate Next.js dashboard.
- No sign-in, admin writes, push sends or purchases were performed. An authenticated order lifecycle remains unverified.
- The local Vite admin and mobile environment files identify `nourish-spoon-f4820`. The separate deployment's server project and service-account configuration could not be verified.
- Firebase CLI failed to list deployed Functions, so this review does not assert their current live deployment status. Existing deployment notes remain historical context.
- Fix deployment startup and admin authentication, then align contracts and route mutations through the authoritative backend. Test with isolated fixtures before verifying with an owner session.
