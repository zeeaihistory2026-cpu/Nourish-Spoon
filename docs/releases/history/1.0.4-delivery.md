# Release verification — 1.0.4

October 13, 2026. The 60-screen browser gallery and updated three-scene hero comparison were shown before the APK build. Previous releases remain available on GitHub.

## Changes

- The native launch keeps the larger gold logo seen first in the owner's video: a complete 224dp mark, centered on cream, with one 3% zoom over 240ms. Android 12+ removes the platform exit animation. The native surface remains until the destination page finishes its fade, avoiding a second smaller React logo. Android 7–11 starting-window artwork uses the same size. System-disabled animations are respected.
- All hero images use one contained frame. Its height is bounded by the hero height, avoiding overflow on larger displays. Shop Now stays 16px from the left and bottom; fixed two-line heading/subtitle slots and narrow-screen typography prevent text from repositioning it. Image, product copy and shopping destination change together. Rotation respects reduced motion and app background state.
- Edit Profile receives the current user's already-loaded phone/name from More. The optional fallback read cannot overwrite a typed or cleared phone. Saving a name during loading omits the untouched phone instead of clearing the server value. Blank phone saves are allowed. A fixed status area prevents form shrinkage. Failed profile writes retain their queue and an older completed write cannot remove a newer pending edit.
- Shop Now appears directly below the drawer's food image/copy and closes the drawer to open all products. Business/shopping destinations remain separate from personal tools in More.
- Header controls have 44px touch targets. Page fades use a 180ms ease-out. Website Cormorant Garamond and Jost fonts, cream/forest/gold palette and existing artwork are retained. No duplicate animations or additional startup photos were introduced.

## QA evidence

Mobile TypeScript passed. Five new profile persistence regressions passed: untouched-number preservation, explicit empty number, queued-number preservation, failed-write retry and overlapping-write cleanup. Nine domain/catalogue tests, five Firebase security tests and five local callable integration tests passed: 24 checks total.

The actual 360×800 browser renders cover launch, three onboarding screens, every hero state, product categories/search/details/combos, cart, guest and signed-in checkout, confirmation/receipt/tracking, accounts/forms, wishlist, addresses, notices, menu/payment/delivery, reviews/proof, story and support. Narrow-screen renders include 320×720 Home, Energy Balls hero and checkout. Test delivery fees, addresses and TCS numbers are illustrative local fixtures.

All 15 hero combinations at widths 320, 360, 393, 430 and 768 had the same 44px Shop Now action at x=16/y=168 within the 228px hero. All three image frames were identical and stayed within the hero bounds. Images share a 1774×887 source size. Profile prefill was immediate, clearing a number remained empty after saving, and measured field/Save positions did not move. Checkout retained entered details across sign-in and payment instructions; an isolated order completed and appeared in Orders. Search, category filters, favourites, quantity controls, reorder, account navigation, drawer Shop Now and sign-out were exercised. Browser console checks produced no application errors.

These are browser renders, not Android-device screenshots. Realme startup, keyboard, system bars and provider login still need device verification.

## Native artifact

Version 1.0.4 / code 5. ARM64, minimum Android API 24, target API 36. Android release compilation and fatal lint passed. Package parsing, V2/V3 signatures, independently forced V1/JAR verification, ZIP CRC integrity and 16KB page/4-byte alignment all passed. The packaged bundle contains the live Firebase project and exact Jost medium/semibold font files, with no demo project or QA credentials. No Android device was connected for installation/runtime testing. Keep the existing ignored signing key; do not clean/regenerate the native project.

Certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`. This matches 1.0.1–1.0.3 and does not match the lost 1.0.0 key.

From `apps/mobile/android`, with JDK 17, SDK/build tools 36 and NDK 28.2.13676358:

```powershell
$env:NODE_ENV = 'production'
$env:NOURISH_NDK_VERSION = '28.2.13676358'
.\gradlew.bat :app:assembleRelease '-Pnourish.ndkVersion=28.2.13676358' '-PreactNativeArchitectures=arm64-v8a' '-Pkotlin.compiler.execution.strategy=in-process' '-Dorg.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=1024m' --max-workers=1 --no-parallel --console=plain
```

## Downloads

- Screens: https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/tag/v1.0.4-ui-review
- APK: https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/tag/v1.0.4-preview
- Screen ZIP contains 60 original PNGs, full-size HTML gallery, seven review sheets and the hero comparison.
- APK: 48,415,514 bytes; SHA-256 `833a28b56cdcb664e258d0028188622183bb873174d9f57424460bac89ce5a3a`.
- Screen ZIP: 10,319,265 bytes; SHA-256 `106d6aa0c3e3aafc51fbe0309fca2c28e64d259718c9a9784235c3c8f5b8b642`.
- Both files are also saved in `F:/Downloads`.

## Live-service limits

Existing Firebase email accounts remain live. New catalogue import, commerce functions/rules and hosted Google/Apple bridge are not deployed: Firebase CLI owner authorization is required. Apple Developer credentials are unavailable. Local commerce/social-handoff tests do not establish working live providers or live checkout. WhatsApp order preparation remains available. Payment methods are manual advance transfers; TCS opens its official tracking site.

Artwork provenance and exact imagegen prompts remain in `docs/design/hero-artwork.md` and `docs/design/combo-artwork.md`. The previous dependency audit remains open: 26 mobile advisories (7 moderate, 19 high); admin Firebase bundle-size warning. Breaking downgrade suggestions were not applied.
