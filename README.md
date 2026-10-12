# Nourish Spoon

Expo React Native mobile app, React admin dashboard, and Firebase commerce backend. The mobile interface follows [nourishspoon.com](https://nourishspoon.com): Cormorant Garamond headings, Jost text, cream/forest/gold colors, product artwork, website reviews and six hero banners.

## Structure

- `apps/mobile/src/screens`: storefront, accounts and business information.
- `apps/mobile/src/features`: commerce screens, Firebase data services and social sign-in.
- `apps/mobile/src/components`: shared UI, navigation, carousel and dialogs.
- `apps/mobile/plugins`: repeatable native Android launch and release-signing configuration.
- `apps/admin/src/features/commerce`: authenticated owner dashboard and focused editors.
- `packages/catalog`: website snapshot and adapter for existing Firebase product documents.
- `packages/types`, `packages/utils`: shared contracts and utilities.
- `functions`: authoritative checkout, order updates, reviews, notifications and protected native auth handoff.
- `hosting`: Firebase-hosted Google/Apple sign-in bridge.
- `tooling`: isolated Firebase emulator security and integration tests.
- `docs/design`, `docs/product`: original design references and product requirements.
- `scripts`: asset extraction and screenshot gallery tools.

Unused source and assets were archived outside the tracked application. Signing keys, environment files, generated builds, previews, test fixtures and cleanup backups are ignored by Git.

## Run locally

Run `npm ci` in `apps/mobile`, `apps/admin`, `functions` and `tooling`. Copy the environment templates into each application's `.env` file and fill in the public Firebase web configuration. Mobile: `npm start` inside `apps/mobile`. Admin: `npm run dev` inside `apps/admin`.

The app includes a custom native Android launch overlay; use a native build to check it. The browser preview cannot validate Android system splash, keyboard or safe areas.

## Features

Email accounts, persistent cart and favorites, product search/size selection, custom delivery city, saved addresses, server-calculated checkout, order history/reordering, gift messages, order stages, manual payment confirmation, TCS consignment links, in-app order updates, published nutrition/storage information and delivered-purchase reviews. More contains shopping/account tools; the burger menu contains delivery and payment information.

The owner dashboard manages Firebase products, variant stock/prices, orders, payment status, consignment numbers, review moderation and delivery settings. Access requires verified `info@nourishspoon.com` or an explicitly assigned `admin` custom claim. Customer clients cannot write order totals, payment or delivery status directly.

## Deployment status

Email accounts and the public catalogue use the existing Firebase project. New commerce functions, revised access rules and hosted native social sign-in are prepared and tested locally, **not deployed to the live project**. Firebase CLI account access is still needed. Apple sign-in additionally requires the owner's Apple Developer provider credentials. Google/Apple UI availability is not proof of a working live provider.

Notifications currently appear inside the app; background push delivery is not implemented. TCS opens its official tracking site; parcel scans are not fetched through a private TCS API. Payment is confirmed manually, without a payment-gateway integration. Loyalty points, coupons and Urdu translation are not included in this release.

See [deployment instructions](docs/backend-deployment.md), [architecture](docs/architecture.md) and [QA/build notes](DELIVERY.md).
