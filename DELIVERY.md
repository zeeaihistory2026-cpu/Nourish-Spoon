# Nourish Spoon delivery

The latest mobile styling follows https://nourishspoon.com/: Cormorant Garamond headings, Jost body/input text, website logo, forest green/cream/gold tokens, and the website's product artwork. The home screen includes all six website carousel banners, centered hero copy, and compact order/explore buttons. Banner assets are bundled for offline display; autoplay pauses when the app is backgrounded or reduced motion is enabled, and manual controls remain available.

The burger menu contains Delivery Information and Payment Methods, with links to the corresponding section. More contains contact links, FAQ, About, ordering, account, and appearance options. Catalog WhatsApp/View Product/cart actions occupy one row, including at 320px widths. Home cards stretch equally and anchor price/cart controls at the bottom. Detail back/favorite controls occupy a separate header so they do not obscure product artwork. The contact hero separates its photograph from the heading and paragraph.

Navigation occupies its own layout space; scrolling content and bottom action panels have 20px of clearance. Screen transitions respect the device's reduced-motion preference.

All 12 publicly displayed website reviews and their individual WhatsApp screenshots are bundled in the app. Names, headlines, messages, ratings, verification badges, and helpful counts come from the website snapshot taken on 2026-10-11. Reviews for both products appear in both product filters. Helpful toggles are local feedback; they do not update website counts. Relative ages from the snapshot are not presented as current dates.

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

Version 1.0.1 (version code 2) was built successfully on 2026-10-11. Its APK SHA-256 is `ED6D486816276BCAC85DBE3EC3B93C094AF42605F3C25FCADCF9FDC77C5185D7`. The final Android bundle was checked for the current carousel, website reviews, and equal-height home card code. Browser review filters returned 12 total reviews, 8 for energy balls, and 10 for Panjeeri; helpful feedback was reversible. Both home cart buttons had the same vertical position at 360px width.

The delivery includes 26 browser screenshots at 360 × 800, a clickable HTML gallery, and a screen overview image. These are browser previews, not Android device screenshots.

The user tested the earlier preview on a physical phone and supplied screenshots. These latest fixes were checked in the browser; no Android device or emulator was connected for an installation test of version 1.0.1. Physical-device keyboard, safe-area, and account persistence checks remain necessary before a production release.

## Rebuild the Android APK

Install dependencies in `apps/mobile`. Set `JAVA_HOME` to JDK 17 and `ANDROID_HOME` to an Android SDK with platform/build tools 36 and a complete NDK installation. This workspace uses NDK `28.2.13676358`.

From `apps/mobile/android`, run in PowerShell:

```powershell
$env:NODE_ENV = 'production'
$env:NOURISH_NDK_VERSION = '28.2.13676358'
.\gradlew.bat :app:assembleRelease '-Pnourish.ndkVersion=28.2.13676358' '-PreactNativeArchitectures=arm64-v8a' '-Pkotlin.compiler.execution.strategy=in-process' --max-workers=1 --no-parallel --console=plain
```

The output is `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`. This build targets ARM64 Android devices running Android 7 or newer.

Release signing uses the local, ignored `apps/mobile/private-signing/signing.properties` and `apps/mobile/private-signing/nourish-release.jks`. This directory is outside the generated Android folder. The Expo config plugin reapplies release signing and the optional NDK override after prebuild; assembling a release without signing properties fails explicitly. Back up both files securely. Neither signing secrets nor the environment file belong in GitHub.

**Installation note for version 1.0.1:** Expo's native resource refresh recreated the Android folder and removed the earlier preview's signing material. A replacement key is now used. This APK cannot update the old 1.0.0 preview in place: uninstall that preview, then install 1.0.1. Uninstallation clears local app settings; Firebase accounts remain available for sign-in. Future updates must use the new backed-up key.
