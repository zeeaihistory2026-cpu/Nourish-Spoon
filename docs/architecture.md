# Architecture

The mobile app keeps navigation and presentation separate from account/commerce services. Shared catalogue normalization accepts the live project's older camelCase product schema and the newer typed schema without substituting bundled prices for server prices. A bundled website snapshot permits browsing before connectivity is available. The server remains authoritative when placing orders.

Cart and favorites persist locally with Zustand/AsyncStorage. Accounts persist through Firebase Auth; account subscriptions clear their data when the signed-in UID changes. Owner-only addresses and notifications reside under user documents. Orders are read with a customer UID query and sorted locally, avoiding a composite index requirement. Approved reviews are public; pending reviews remain private to the reviewer and owner.

Callable checkout uses an account-scoped idempotency key and a Firestore transaction. It reads current product prices, aggregate legacy stock or variant stock, address and delivery settings. Unknown fees remain an unconfirmed quote rather than becoming free delivery. Concurrent checkout cannot oversell known inventory. Cancellation restores inventory once. Order stages cannot skip forward or reopen a completed order. Customers cannot mark themselves paid or dispatched.

The owner dashboard uses Firebase directly for owner-managed catalogue and settings documents, and protected functions for order changes. Reviews require a delivered order containing the reviewed product and are moderated before publication. Notifications are in-app records written by an order-update trigger.

Native social authentication uses a Firebase-hosted provider popup and an expiring, one-use authorization code. The app redeems it with a secret verifier matching a SHA-256 challenge. Neither OAuth access tokens nor Firebase custom tokens travel in the deep link. Live provider configuration is an external deployment requirement.

Android launch uses a native centered transparent logo overlay before React is ready. It is removed when the app logo has successfully loaded; both stages show the same contained logo on cream. No food image or launch text is shown. App typography loads locally before normal screens.

No signing keys, service-account keys, Google/Apple private provider credentials or GitHub tokens belong in the repository. The generated Functions catalogue adapter is produced from the canonical shared ESM source during build rather than maintained as a duplicate.

Commerce screens share page/card/field primitives and receipt item/totals components. Orders list history, OrderDetails holds the receipt/reorder/review flow, OrderTracking holds fulfilment and TCS, and OrderConfirmation is entered only after the server accepts checkout. Fulfilment timestamps are written by the owner function on actual status changes; legacy missing times are not synthesized.

Checkout drafts live in a dedicated memory-only Zustand store, separate from persisted cart/favourites. They preserve navigation to sign-in and payment instructions, retain the request ID on retries, and clear on completion or account change. Personal destinations belong in More; the drawer owns shop and business information.

Mobile TypeScript explicitly includes source/shared packages and excludes generated preview bundles to prevent exported JavaScript from entering type checking.
