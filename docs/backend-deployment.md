# Firebase deployment and owner handover

Target project: `nourish-spoon-f4820`. New rules/functions/Hosting have not been deployed: the CLI has no authorized account and the existing signed-in browser could not be reached by the browser tool. A browser login does not authorize the CLI automatically.

1. Install dependencies in `functions` and `tooling`. Use a Node version supported by Firebase CLI; deployed Functions use Node 22.
2. Sign in using the Google account that owns the Firebase project: `node tooling/node_modules/firebase-tools/lib/bin/firebase.js login`.
3. Review Firebase billing requirements for Cloud Functions. Do not enable or upgrade billing without the owner's decision.
4. Build: `npm --prefix functions run build`. The CLI predeploy hook also generates `functions/lib/normalizeProduct.js` from shared catalogue code.
5. Deploy from the repository root: `node tooling/node_modules/firebase-tools/lib/bin/firebase.js deploy --only firestore,functions,hosting --project nourish-spoon-f4820`. If function discovery times out, set `FUNCTIONS_DISCOVERY_TIMEOUT=60` for this command.
6. Keep Email/Password enabled. Enable Google and verify the Hosting origin is an authorized Firebase Auth domain. Native Google uses the hosted web-provider bridge, not an Android native Google SDK.
7. Apple requires an Apple Developer membership, configured Services ID, team/key IDs, private signing key and Firebase Apple provider callback configuration. These have not been supplied. Do not advertise a working Apple account option until an actual provider login passes.
8. Sign in as the verified `info@nourishspoon.com` account, or assign an admin custom claim to an explicitly approved owner UID through a trusted server/Admin SDK. Do not grant admin by an editable profile field.
9. Review existing products in the dashboard before importing anything. Legacy documents are adapted automatically. Import the website snapshot only if the catalogue is empty. Set real stock, delivery fees and any free-first-order policy; unknown values remain unconfirmed.
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
