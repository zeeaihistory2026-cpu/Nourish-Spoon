# Nourish Spoon delivery

The mobile interface uses the supplied screen artwork, forest green and cream palette, Libre Baskerville headings, and Lato body text. Navigation occupies its own layout space; scrolling content and bottom action panels have 20px of clearance. Screen transitions respect the device's reduced-motion preference.

## Accounts and data

Email/password accounts use Firebase project `nourish-spoon-f4820`. Signup, sign-in, sign-out, and password reset are implemented. Social sign-in is omitted as requested. The Firebase web configuration belongs in `apps/mobile/.env`; use `.env.example` as the template.

Firebase account creation, profile display-name updates, incorrect-password rejection, and successful sign-in were tested against the live project. The temporary QA account was deleted.

Payment information directs customers to the business for current account details, rather than presenting the sample bank account from the mock data as an official account.

Firestore customer profile writes and owner reads were verified against the existing deployed rules. Unauthenticated reads of the test profile were denied. The replacement rules prepared in `firestore.rules` have not been deployed or fully audited. Pending customer details are retained locally and retried after authentication. The product catalog and admin dashboard still use local data; the dashboard is not a complete cloud administration backend. Notification drafts are local and do not send push notifications.

One additional temporary profile QA account (`nourish-profile-qa-…@example.invalid`) and its `users/{uid}` document remain in Firebase. The existing rules rejected profile deletion, and a cleanup exception prevented deletion of the authentication account. The diagnostic cleanup routine was corrected, but console access is currently unavailable. In Firebase Authentication, find that email prefix, note its UID, and delete the account and matching Firestore user document through the console before launch. The earlier authentication-only QA account was successfully deleted.

## Verification

- Mobile TypeScript check and production web export.
- Admin production build.
- Browser inspection at phone widths, product search and empty states, product variant selection, order validation, modal dismissal, and tab navigation.
- Live Firebase email/password test: `node --env-file=apps/mobile/.env scripts/verify-firebase-auth.mjs`.
- Android release build and APK signature verification.

No Android device or emulator was connected for an installation test. Physical-device keyboard, safe-area, and account persistence checks remain necessary before a production release.

## Rebuild the Android APK

Install dependencies in `apps/mobile`. Set `JAVA_HOME` to JDK 17 and `ANDROID_HOME` to an Android SDK with platform/build tools 36 and a complete NDK installation. This workspace uses NDK `28.2.13676358`.

From `apps/mobile/android`, run in PowerShell:

```powershell
$env:NODE_ENV = 'production'
$env:NOURISH_NDK_VERSION = '28.2.13676358'
.\gradlew.bat :app:assembleRelease '-Pnourish.ndkVersion=28.2.13676358' '-PreactNativeArchitectures=arm64-v8a' '-Pkotlin.compiler.execution.strategy=in-process' --max-workers=1 --no-parallel --console=plain
```

The output is `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`. This build targets ARM64 Android devices running Android 7 or newer.

Release signing uses the local, ignored `apps/mobile/android/signing.properties` and `apps/mobile/android/keystores/nourish-release.jks`. Back up both files securely: future updates must use the same signing key. Neither signing secrets nor the environment file belong in GitHub. If signing properties are absent, the Gradle project falls back to the development key; do not distribute that fallback as a production update.
