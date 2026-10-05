# Nourish Spoon — Customer Mobile App

React Native (Expo SDK 57) customer app for Nourish Spoon, built pixel-faithful to the supplied
design concept (splash → onboarding → auth → shop → cart → checkout → orders → profile) on a
Firebase backend with server-validated order and review flows.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | React Native 0.86 / Expo SDK 57, TypeScript (strict) |
| Navigation | React Navigation v7 (native stack + custom bottom tabs) |
| Backend | Firebase Auth, Cloud Firestore, Storage, Cloud Messaging, Cloud Functions, Analytics |
| State | Zustand (cart / wishlist / settings / onboarding, persisted via AsyncStorage) |
| Forms | React Hook Form + Zod |
| Fonts | Cormorant Garamond (display) + Jost (UI) via `@expo-google-fonts` |

## Project layout

```text
App.tsx / index.ts        entry + providers
src/
  app/                    navigation (root/auth/main) + AuthProvider/AppProviders
  components/
    ui/                   design-system primitives (Button, Input, Screen, Stars, …)
    common/               app-level shared components (header, tab bar, cards, drawer)
  features/
    splash/ onboarding/ auth/ home/ products/ cart/ checkout/ orders/
    reviews/ about/ profile/ notifications/
  services/
    firebase/             config, auth, firestore helpers, functions, messaging, storage
    analytics/            centralized event tracking
  store/                  zustand stores
  theme/                  colors, typography, spacing, radius, shadows, fonts
  types/                  shared domain models
  utils/ constants/       currency, dates, errors, whatsapp, brand constants
functions/                trusted server logic (createOrder, setOrderStatus, createReview, …)
firestore.rules           role-based security rules
firestore.indexes.json    composite indexes for every query the app runs
scripts/seed-database.mjs one-shot catalogue seeder
```

## Getting started

### 1. Firebase project

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Add an **Android** app (`com.nourishspoon.app`) and an **iOS** app with the same id; download
   `google-services.json` and `GoogleService-Info.plist` into the repo root (both git-ignored).
3. Enable **Authentication → Email/Password**, **Firestore**, **Storage**, and **Cloud Messaging**.

### 2. Run the app

```bash
npm install
npx expo prebuild          # first time only — generates android/ and ios/
npm run android            # or: npm run ios
```

Firebase initialization is picked up from the native config files; no keys live in JS.

### 3. Seed the catalogue

```bash
# Firebase console → Project settings → Service accounts → generate a key
# save it as ./serviceAccountKey.json (git-ignored)
npm run seed
```

Creates the four products, four categories, sample reviews and the `meta/` counters the app reads.

### 4. Deploy the backend

```bash
cd functions && npm install && cd ..
npm run deploy:backend     # rules + indexes + cloud functions
```

### 5. Grant staff/admin

Roles are **custom claims**, never client state. After sign-up, promote your operator account once:

```js
// Firebase console → Cloud Functions → or via the admin SDK
admin.auth().setCustomUserClaims(OPERATOR_UID, { admin: true });
```

## Security model

- `createOrder` runs in a Firestore transaction: it re-reads every product, prices the order from
  server data, checks stock, decrements it, and only then writes the order. Client totals are never
  trusted.
- `createReview` decides `verifiedPurchase` from the caller's **delivered** orders — the client
  cannot set it, and the rules forbid direct `reviews`/`orders` writes.
- Rules enforce: customers read/write only their own profile, addresses, wishlist, devices and
  notifications; catalogue is public read / admin write; `role` is immutable from the client.
- Push notifications are sent from Cloud Functions via the user's device tokens — no server
  credentials ship inside the app.

## Testing & quality

```bash
npm run typecheck   # tsc --noEmit
npm test            # jest (cart math, delivery thresholds, validation schemas, rating summary, …)
```

The Jest suite loads the jest-expo preset inline (see `jest.config.js`) to avoid a Jest 30
preset-resolution quirk. On Windows, Jest's module resolver uses a native binding
(`unrs-resolver`) that needs the Microsoft Visual C++ Redistributable — present on virtually all
dev machines; install [vc_redist.x64](https://aka.ms/vs/17/release/vc_redist.x64.exe) if Jest
reports "module not found" for existing files.

## Notes

- Delivery pricing (`Rs. 150` under `Rs. 2,500`, free above) is defined in `src/constants` for
  display and mirrored in `functions/src/index.ts` for billing — keep the two in sync when pricing
  changes.
- The WhatsApp number in `src/constants` is a placeholder; set `SUPPORT.whatsappNumber` to the
  business line (digits only, international format).
- Google/Apple sign-in buttons are wired as "coming soon" until those providers are enabled in the
  Firebase console — the architecture is ready for them.
