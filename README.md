# Nourish Spoon

Expo React Native app, React owner dashboard, and Firebase commerce backend. The app uses the website’s Cormorant Garamond/Jost fonts, forest/cream/gold palette, photography and published reviews, adapted to a compact mobile shopping flow.

## Structure

- `apps/mobile/src/screens`: storefront, accounts and business information.
- `apps/mobile/src/features`: commerce and Firebase account/data services.
- `apps/mobile/src/components`: shared product artwork/cards, fixed hero, navigation and dialogs.
- `apps/mobile/plugins`: repeatable Android launch and signing configuration.
- `apps/admin/src/features/commerce`: owner dashboard and focused editors.
- `packages/catalog`: owner catalogue, website snapshot, categories and Firebase normalization.
- `packages/types`, `packages/utils`: shared contracts and utilities.
- `functions`: authoritative checkout, fulfilment, reviews, notices and secure native auth handoff.
- `hosting`: hosted Google/Apple sign-in bridge.
- `tooling`: isolated Firebase security/integration tests and local fixtures.
- `docs`: architecture, deployment, original designs and product sources.
- `scripts`: asset extraction and screenshot galleries.

Signing keys, environment files, builds, previews, test fixtures and cleanup backups are ignored by Git.

## Run locally

Run `npm ci` in `apps/mobile`, `apps/admin`, `functions` and `tooling`. Configure the supplied environment templates. Run `npm start` in mobile or `npm run dev` in admin.

The launch is a complete centered transparent logo on cream. Home has one fixed-height hero with three crossfading food backgrounds, category shortcuts, equal product cards and combos. A header cart, Cart tab and View Cart bar provide direct access. Checkout uses Delivery, Payment and Review steps; a memory-only draft survives sign-in or a visit to payment instructions. Order confirmation, receipt and tracking have separate screens. Product actions and navigation occupy their own layout space.

The October 12 owner catalogue includes two Panjeeri recipes, two Energy Ball sizes and six combos: nine product records and twelve size/pack choices. Source prices are in [catalogue notes](docs/product/catalogue/README.md). Unconfirmed recipe nutrition, stock and pack contents are not invented.

## Features and deployment

Email accounts, persistent cart/favorites, search/category/size selection, custom delivery city, saved addresses, checkout, order history/reordering, gift messages, fulfilment stages, manual payment confirmation, TCS links, in-app updates, and delivered-purchase reviews. Fulfilment changes record timestamps; older stages without timestamps remain explicitly unavailable. Home, Products, Cart, Orders and More are the five main tabs. More contains profile, wishlist, addresses, TCS lookup, notifications and support. The drawer contains shopping categories, story, reviews, delivery information and payment methods, with no duplicate account tools.

The owner dashboard manages products, variant stock/prices, orders, payments, TCS numbers, review moderation and delivery settings. Owner access requires verified `info@nourishspoon.com` or an admin custom claim. Missing catalogue records can be imported without replacing existing records.

Existing email accounts are live. The new catalogue import, commerce functions, revised rules and hosted social bridge are **not deployed**. Firebase CLI account authorization is still required. Apple additionally requires Apple Developer provider credentials. Google/Apple buttons do not establish working live providers.

Notifications are in-app, TCS opens its official site, and payments are manual. Push notifications, a payment gateway, loyalty, coupons and Urdu are not included. See [deployment](docs/backend-deployment.md), [architecture](docs/architecture.md) and [QA notes](DELIVERY.md).
