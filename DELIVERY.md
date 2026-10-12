# UI review and QA — 1.0.3

This is the pre-APK design review requested on October 12, 2026. A new 1.0.3 APK has not been built. The previously released 1.0.2 APK remains unchanged.

## Changes

- Logo-only Android and app launch; complete transparent mark, centered and contained. App transition waits for successful image loading.
- One 228px minimum-height hero with stable text/button and three gently crossfading 2:1 cream food backgrounds. Full images use contain with a smooth top/left fade rather than different image heights. No standalone page carousel or arrows. Rotation respects reduced motion and background state.
- Compact category shortcuts, equal serif-title product cards, combo section and directly accessible cart. Home/Products/Cart/Orders/More tabs follow the shopping flow.
- Cream cart/profile cards, a three-step checkout, separate confirmation/receipt/tracking screens, and shop/business drawer destinations distinct from personal tools in More.
- Memory-only checkout draft preserves address, payment step and idempotency key across navigation; signing out clears it.
- Verified the live website fonts on October 12: Cormorant Garamond headings, Jost body/buttons. Local Jost 400/500/600/700 files are bundled.
- Nine owner-supplied product records with twelve size/pack choices, including sugar/no-added-sugar Panjeeri and six combos.
- Product cards share a 3:2 frame. A single combo artwork replaces the two-thumbnail composition. Single-product photography remains the website originals.
- No category-based cart substitution. Old/unavailable cart records must be removed before checkout.
- Recipe-specific nutrition/reviews are not assumed. New recipe FAQ copy acknowledges added-sugar choices.
- Missing-product import in the owner dashboard preserves existing records through Firestore transactions.

## Verification

Mobile TypeScript and admin production build passed. Nine backend domain/catalogue tests passed. Five Firestore security tests and five local callable integration tests passed with the updated catalogue, including authoritative prices, idempotency, stock races, fulfilment/TCS/reviews one-use native auth handoff, and recorded status history without repeated-stage duplication. The rule-test source now resolves its rules path relative to the module, so it runs correctly from the repository root or tooling folder.

The 56-image screen gallery contains actual browser renders at 360×800 and a 320×720 home check. Commerce/account previews use isolated local test data; displayed test delivery fees and TCS numbers are illustrative. It includes logo launch, onboarding, all three hero backgrounds, products/categories/combos, details/search/cart, guest and signed-in checkout, sign-in/signup/password reset, profile editing, wishlist, menu/payment/delivery, reviews/proof, story/profile/support, addresses, orders/tracking/notifications and FAQ.

Email login, signup validation/creation, password visibility/reset, sign-out, profile/address saving, product search, wishlist, quantity controls, successful checkout/confirmation and draft retention were exercised against isolated services. At 320px both home Add buttons have identical Y coordinates and 44px heights.

These are browser previews, not Android device screenshots. Physical-device startup, keyboard, safe areas and social-provider login still require Android verification. The new native release has not been compiled in this review phase.

## Live limits and source artwork

Email accounts use the existing Firebase project. New catalogue import/rules/functions/social hosting are pending authorized deployment. Apple credentials are unavailable. Guest WhatsApp ordering remains available; failures must not be treated as successful orders.

The combo artwork is AI-assisted reconstruction of the supplied screenshot, corrected using the official chef-hat logo. It is illustrative packaging artwork rather than a pixel-identical extraction. Source and exact built-in imagegen prompts are in `docs/design/combo-artwork.md`. The three cream hero backgrounds were also generated using the supplied references. Exact prompts and asset paths are in `docs/design/hero-artwork.md`. No fabricated ratings or nutrition badges were added.

The previous dependency audit remains open: 26 mobile advisories (7 moderate, 19 high), and the admin build warns about its Firebase bundle size. Breaking downgrade suggestions were not applied.

## Next native build

Version 1.0.3 / code 4, ARM64, Android 7+. Keep the existing ignored signing key. V1, V2 and V3 signing are explicitly configured; signature and archive verification must be repeated after compilation. Do not regenerate or clean the Android project.

From `apps/mobile/android`, with JDK 17, SDK/build tools 36 and NDK 28.2.13676358:

```powershell
$env:NODE_ENV = 'production'
$env:NOURISH_NDK_VERSION = '28.2.13676358'
.\gradlew.bat :app:assembleRelease '-Pnourish.ndkVersion=28.2.13676358' '-PreactNativeArchitectures=arm64-v8a' '-Pkotlin.compiler.execution.strategy=in-process' '-Dorg.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=1024m' --max-workers=1 --no-parallel --console=plain
```

Private signing: `apps/mobile/private-signing`. Certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`. The key matches 1.0.1/1.0.2; it does not match the lost 1.0.0 key.
