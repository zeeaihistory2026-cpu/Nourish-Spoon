# Delivery and QA notes

The app follows the website's Cormorant Garamond/Jost typography, forest/cream/gold palette, artwork and six promotional banners. Hero images preserve their full framing; swipe, dots and autoplay remain, and previous/next arrows are removed. Autoplay pauses in the background and for reduced motion. The transparent logo replaces the textured square in the launch, header, menu and account screens; UI logo color is the website gold.

The native launch photo and app splash preserve the complete panjeeri/laddu image. Android 12's initial system-managed splash has a centered padded icon on cream, followed by the photo/text launch screen. Home cards have matching heights and aligned cart controls. Product WhatsApp/View/cart actions share one row at 320px and 360px. Detail actions and navigation occupy separate layout space. Scrollable screens end with 20px clearance above navigation. Custom city fields accept cities outside any predefined list.

More contains cart, order history, tracking, saved addresses, notifications, FAQ, account and contact tools. The burger menu contains delivery information and payment methods. Published website reviews and their individual proof images are bundled. Nutrition/storage values are website figures, not a laboratory verification; allergen descriptions are based on published ingredients.

## Checks completed on 2026-10-12

- Mobile TypeScript check and native release compilation.
- Admin TypeScript/production build after extracting editors and removing demo pages/assets.
- Eight backend domain/catalogue tests: authoritative pricing, unknown fees, first-order policy, malformed quantities/overselling, custom cities, order stages and legacy Firebase product compatibility.
- Five Firestore rules tests: owner privacy, protected order writes, address schema/privacy, untamperable notifications and private reviews/auth handoff.
- Five callable integration tests: idempotent checkout, customer privilege rejection, fulfilment/TCS/review rules, concurrent stock/cancellation and one-use auth handoff.
- Browser QA: signup, sign-in, password visibility and field validation, search/filtering, cart quantities, custom-city checkout, saved-address create/edit/remove, order navigation, notification navigation and menu separation. Website reviews, image framing and small-phone layout were visually inspected.
- APK v2 signature validation, Android package/version and ARM64/minimum SDK inspection.

The 26-screen gallery consists of actual browser renders. Commerce screenshots use isolated demo data, including illustrative delivery fees. They are not Android device screenshots. A final APK signature/build check does not establish physical-device startup, keyboard, safe areas or provider login; those still require a connected phone/emulator.

## Live-service limits

The existing Firebase project handles email accounts and its public catalogue. Revised rules, commerce functions and native social Hosting bridge are prepared and tested locally but not deployed. CLI account authorization is unavailable. Google needs enabled/configured Firebase provider access; Apple additionally needs an Apple Developer account and provider credentials, which have not been supplied. The app keeps guest WhatsApp ordering available and reports service errors without pretending an order succeeded.

Notifications are in-app updates; background push is not implemented. TCS scans open on the official TCS website, without a private carrier API integration. Payments are confirmed manually. Coupons, loyalty and Urdu translation are not included. See `docs/backend-deployment.md` for deployment and owner handover, including cleanup of the earlier residual live QA account.

Dependency audit remains open: mobile dependencies report 26 advisories (7 moderate, 19 high), including transitive Expo/Metro/Firebase build tooling. The earlier critical advisory was resolved. Breaking downgrade suggestions from `npm audit fix --force` were not applied. Review supported upstream upgrades before production distribution. The admin build also warns about its large Firebase bundle.

## Rebuilding and signing

Install dependencies and configure `apps/mobile/.env` from the template. Use JDK 17, Android SDK/build tools 36 and NDK 28.2.13676358. From `apps/mobile/android`:

```powershell
$env:NODE_ENV = 'production'
$env:NOURISH_NDK_VERSION = '28.2.13676358'
.\gradlew.bat :app:assembleRelease '-Pnourish.ndkVersion=28.2.13676358' '-PreactNativeArchitectures=arm64-v8a' '-Pkotlin.compiler.execution.strategy=in-process' '-Dorg.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=1024m' --max-workers=1 --no-parallel --console=plain
```

Output: `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`, version 1.0.2 / code 3, ARM64, Android 7+.

Private signing remains in the ignored `apps/mobile/private-signing` folder, outside generated native files. Back up the JKS and signing properties securely. Certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`. Version 1.0.2 uses the same key as 1.0.1 and can update that preview. It cannot update the old 1.0.0 preview signed by the lost earlier key.
Final APK SHA-256: `35773A9800C34D4A1446619A36D034BA9909F7AC0BDF7FAD986C5E297A92DBAA`. Size: 41,423,010 bytes. The bundle contains the live project ID and transparent-logo asset; demo project IDs and QA passwords are absent. Final package inspection confirms obsolete external-storage/overlay permissions are absent.
