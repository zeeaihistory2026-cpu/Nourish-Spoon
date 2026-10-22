# Architecture

Nourish Spoon has one customer app, one admin dashboard and one shared Firebase database. The canonical source is this repository. The standalone dashboard repository is an export for Vercel deployment, not a second independently maintained backend.

## Source boundaries

| Location | Responsibility |
| --- | --- |
| `apps/mobile/src/application` | Startup, session lifecycle, navigation and screen composition |
| `apps/mobile/src/screens` | Storefront, account, brand and information screens |
| `apps/mobile/src/features/commerce` | Basket, checkout, order history, tracking, rewards and receipts |
| `apps/mobile/src/components` | Shared presentation and website-style review cards |
| `apps/mobile/src/services` | Firebase client, subscriptions, scoped persistence, photos and push registration |
| `apps/mobile/plugins` | Repeatable native Firebase and launch configuration |
| `apps/admin/src/app` | Next.js pages and authenticated server routes |
| `apps/admin/src/components` | Dashboard presentation and forms |
| `apps/admin/src/lib` | Server authorization, record adapters, financial calculations and PDFs |
| `functions/src` | Shared transactional order, stock, reward and review operations; callable transport |
| `packages` | Shared catalogue normalization, delivery policy, types and utilities |
| `tooling` | Isolated tests and optional artwork/preview tools |

## Accounts and data

Login is mandatory for customer destinations. Public catalogue and approved-review reads can warm during launch, but they do not grant guest access. A validated, previously server-verified catalogue cache supplies the initial display while Firestore refreshes it. Bundled prices and unverified cached snapshots cannot unlock checkout prices. Final ordering always uses current server records.

Orders, addresses, notifications, reward balances and profile media are account-scoped. Subscriptions and account state clear when the signed-in UID changes. Reviews become public only after dashboard approval. The shared database contract and exact collection names are documented in [the backend contract](../apps/admin/docs/SHARED_BACKEND.md).

## Checkout and fulfilment

Android calls the dashboard's authenticated `/api/shop/{action}` routes with a Firebase ID token. Anonymous tokens are rejected. Browser customers additionally require an allowed origin. The server uses the same transaction modules as the callable transport, so both apps share product IDs, orders, stock, offers and rewards.

An account-scoped request ID prevents duplicate orders and reservations. Transactions recalculate product prices, optional coupon/points deductions and delivery. Delivery is Rs. 250 unless the product amount after discounts exceeds Rs. 2,500; pickup is free. Known stock cannot be oversold. Cancellation restores inventory once. Payment verification and fulfilment remain server-controlled.

Admins may move an order forward to preparation, out for delivery or delivered without first entering tracking. Supplied TCS numbers are validated and may be added later. Completed and cancelled orders cannot be reopened. Saved status timestamps represent actual changes; missing historical times are not invented.

Referral links are accepted before the customer's first order. Paid delivery settles earned points and referral rewards once. Refunds/cancellations reverse eligible wallet changes through the ledger. Coupon and wallet previews do not authorize a final discount; placement validates them again.

## Reviews, notifications and documents

One review is allowed per delivered order/product. Optional compressed JPEGs live in separate media documents. Pending feedback remains private; approved purchase reviews and the published website testimonials use the same mobile card. Profile thumbnails are private to their account.

Order transactions create customer inbox records. Dashboard announcements create inbox messages and submit FCM notifications to registered Android installations. Logout unregisters the installation from the old account. An FCM acknowledgement means the service accepted the message, not that the phone displayed it. Admin new-order alerts have their own bell, toast and read cursor.

Customer-owned receipt PDFs use saved item amounts, discount, delivery and total. PAID is shown only for saved paid status. Dashboard revenue and weekly/monthly reports count saved paid-order totals independently of delivery. Refunded/unpaid orders are excluded. Pakistan calendar boundaries are shared by the KPI, graph and PDF. Historical paid records without a payment date use their order date, with that limitation disclosed.

## Native and deployment sources

The native launch mark and jar lettering are vector paths. Expo plugin templates are authoritative; native copies and Android/Expo version numbers are checked by the repository audit. Text fonts load locally. Private signing keys, Firebase Admin credentials and device tokens never belong in Git or the APK.

`functions/scripts/build.js` generates shared catalogue/delivery adapters. `scripts/export-dashboard.mjs` exports the Next.js app and required transaction modules into a standalone checkout. Generated deployment copies must be regenerated from the canonical source rather than edited independently.
