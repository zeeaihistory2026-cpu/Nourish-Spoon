# Firebase Setup — Nourish Spoon

The app code is fully integrated with Firebase (`@react-native-firebase`:
Auth, Firestore, Messaging, Storage, Functions). To go live, you only need
to connect your Firebase project. ~10 minutes.

## What you do in the Firebase console (console.firebase.google.com)

1. **Create a project** called `Nourish Spoon` (analytics optional).
2. **Add an Android app**
   - Package name: `com.nourishspoon.app`
   - Download `google-services.json`
3. **Add an iOS app**
   - Bundle ID: `com.nourishspoon.app`
   - Download `GoogleService-Info.plist`
4. **Enable products** (left sidebar → Build):
   - Authentication → Sign-in method → enable **Email/Password**
   - Firestore Database → Create database → start in **production mode**
   - Cloud Messaging → no setup needed (works once the apps are registered)
5. **Deploy the security rules** (already written in this repo):
   ```bash
   firebase deploy --only firestore:rules
   ```
6. **Deploy the Cloud Functions** (order/review transactions, role claims):
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```

## What you do in this repo

1. Copy the two downloaded files into the **project root** (next to `app.json`):
   - `google-services.json`
   - `GoogleService-Info.plist`
   
   They are gitignored — never commit them.
2. Create your `.env` from the template:
   ```bash
   cp .env.example .env
   ```
   (It already sets `EXPO_PUBLIC_DEMO_MODE=false` — that's the switch that
   takes the app off local demo data and onto your Firebase backend.)
3. Seed your catalogue: add your products to the `products` collection in the
   Firestore console (or ask Muse to generate a seed script from `src/demo`).

## Build

Firebase needs native modules, so Expo Go won't work. Build with EAS:

```bash
npm install -g eas-cli
eas build --platform android   # and/or --platform ios
```

## Notes

- Order/review writes are temporarily client-side (see `firestore.rules`
  comments). They become server-authoritative automatically once the Cloud
  Functions are deployed and the rules' `allow create` lines are tightened.
- Admin/staff roles are set via the `setUserRole` function — call it once
  from the Firebase console for your own UID to become admin.
