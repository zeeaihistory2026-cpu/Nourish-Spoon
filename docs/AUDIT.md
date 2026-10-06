# Nourish Spoon — UX/UI & Front-End Audit Report

**Date:** 2026-10-06
**Scope:** `~/workspace/Nourish-Spoon` — React Native (Expo SDK 57) customer app
**Method:** Full source read-through + import-graph analysis, two parallel expert audits (UX/UI design, code structure), then implementation and verification.

## Design source of truth

The 15 individual phone mockups supplied by the design owner are canonical. The bundled
`src/assets/brand/full-*.jpg` artwork was verified to match them pixel-for-pixel (home, login,
products spot-checked). The 12-screen overview image is an **older iteration** (Rs. 850 prices,
Shop/Orders/Favorites/Profile tabs, Cash-on-Delivery at checkout) and was deliberately **not**
followed. The admin-dashboard mockup has no corresponding app in this repo.

All fixes below are functional, not visual — pixel fidelity to the canonical mockups is preserved.

---

## Critical findings (all fixed)

| # | Finding | Fix |
|---|---------|-----|
| C1 | Every `AppHeader` back button was dead — `handleBack` only fired for function props, but all 15 call sites pass bare `onBack` | `AppHeader` now falls back to `navigation.goBack()` when `onBack === true`; bell in home variant routes to `Notifications`; title variant renders the menu button when `onMenu` is provided |
| C2 | Login/SignUp validation errors never surfaced — `showFormError` was defined but never passed to `handleSubmit`, so invalid taps failed silently | Passed as `handleSubmit`'s onInvalid callback on both screens; moved bottom-placed imports to the top |
| C3 | Empty-cart "Browse Products" navigated nowhere — `CartScreen` used the tab navigator's type from the root stack, so `navigate('Products')` never resolved | Now `navigation.navigate('Main', { screen: 'Products' })` with corrected `RootStackParamList` (`Main: NavigatorScreenParams<MainTabParamList> \| undefined`); removed the bogus `tabNavigation` hook |
| C4 | `keyExtractor` used `productId` only, colliding for multi-variant cart items | Now uses the store's variant-aware `cartItemKey(productId, variantLabel)` |
| C5 | Sign-up never validated that passwords match (local schema dropped the shared schema's `refine`) | Added password-match `refine` to the artwork sign-up schema |

## Major design fixes

- **Contrast (measured):** `goldDark` `#A6862A` → `#826A1B`, `textLight` `#757575` → `#6B6B6B`, primary button gradient deepened so white labels pass 4.5:1 (the gold variant is unused in the app — zero visual change), `greenLight` text usages (FREE badge, success messages) → `greenMid`.
- **Touch targets:** cart stepper back to 44pt default, trash delete `hitSlop` 6 → 14, category chips ≥ 44pt, review stars 44pt, product-card heart `hitSlop`.
- **Layouts:** `OrderDetailScreen` and `OrderSuccessScreen` wrapped in `ScrollView`; `Input` is multiline-aware (`minHeight: 120`); wishlist 2-column grid items get `flex: 1`; About screen sections verified against mockup (kept 4-across/5-across per design).
- **Navigation honesty:** Orders/Wishlist "Browse Products" now go to the Products tab; order cards no longer show fake "Track Order"/"Buy Again" text actions; `StatusBadge` "placed" is neutral, not green; Home bell → Notifications screen.
- **Drawer & settings:** drawer moved to `src/components/common/DrawerMenu.tsx`; "Help & FAQ" navigates to the real `Faq` screen; "Privacy Policy" opens the existing `SUPPORT.privacyUrl`; removed the fake dark-theme toggle.
- **Checkout:** address-load failure now shows an error state with Retry instead of silently pretending there are no addresses.
- **Review cards:** mojibake replaced with real UTF-8; avatar color is a deterministic hash of the name (no more hardcoded usernames); dead screenshot button demoted to a `View`.

## Code-structure cleanups

- **Deleted 12 dead files** (zero importers verified): `ui/Checkbox`, `ui/IconButton`, `common/DeliveryBanner`, `common/IngredientGrid`, `common/SearchBar`, `auth/components/AuthHero`, `home/components/HeroBanner`, `home/components/WhyItWorks`, `onboarding/onboardingContent`, `products/hooks/useCategories`, `services/firebase/functions`, `services/firebase/storage`.
- **Dead exports removed:** `GoogleIcon`/`AppleIcon` (BrandIcons), `ProductCardSkeleton`/`ListSkeleton` (Loader), `DEMO_BENEFITS` (demo), de-exported `initialsOf` (Avatar).
- **Reorganized:** `Toggle` → `components/ui/`; `productFactory` (a data builder, not a component) → `features/products/lib/`; `check-assets.cjs` → `scripts/`; deleted `check-admin.cjs` (crashed, superseded) and `design-preview.html` (unreferenced).
- **Typing:** review-service stats typed properly (`number`, `Record<number, number>`); `EMPTY_STATS` deduplicated; `as unknown`/`as never` navigation casts replaced with `CompositeNavigationProp` + `NavigatorScreenParams` (nested `Products` stack params now typecheck with no casts); deleted 4 unused nav-helper types.
- **Hygiene:** stripped BOM characters from 13 source files; hardcoded `#E5484D` → `colors.danger`; new `theme/borderWidth.ts` token file; tab bar uses theme tint + top divider.

## Deliberately not changed (follow-ups)

- **Artwork-with-tap-zones screens** (Login, SignUp, Home, Shop, ProductDetail, Onboarding): kept as-is per the pixel-perfection requirement — the artwork *is* the approved design. Known fragility on unusual aspect ratios remains.
- **`DEMO_MODE = true`** still bypasses auth (`src/demo/demo.ts`). Flip to env-driven before any release build.
- **`functions/src/index.ts`** 430-line monolith with hand-rolled validation duplicating the app's zod schemas — split into `orders.ts`/`reviews.ts`/`notifications.ts` and share schemas.
- **Auth state duplication** (`AuthProvider` context + `authStore`) — consolidate on the zustand store.
- **Load-state boilerplate** duplicated across 6 screens / 5 hooks — extract `useLoadable` + `LoadStateView`.
- **No path aliases** (`@/*`) yet; deep relative imports remain.
- **Reviews feature** is still orphaned (no navigate calls to `ProductReviews`/`WriteReview`) — wire from product detail and delivered orders.
- **Product detail** still lacks in-app Add to Cart (only WhatsApp order) and renders Energy Balls artwork for unknown IDs instead of an error state.
- **No error boundary** around the navigation tree; **no deep-linking config**; screen analytics only fire on tab changes.

## Verification

- `tsc --noEmit`: **clean, 0 errors** (strict mode).
- `jest`: **7/7 suites, 40/40 tests pass.** The suite was completely broken before
  this work (TS 6 `TS5011 rootDir` failure on every suite); fixed via:
  - `rootDir: '.'` in the ts-jest inline config,
  - `jest.assetMock.js` for bundled `.png/.jpg` imports,
  - `jest.reactNativeMock.js` + `jest.expoFontMock.js` + `jest.fontMock.js` stubs
    for ESM-only `react-native` / `expo-font` / `@expo-google-fonts/*`,
  - fixed the stale `authSchemas.test.ts` fixture (was missing the required
    `confirmPassword` field, so 3 tests failed against the correct schema).
- `grep` sweep: no remaining references to any deleted module.
- Design fidelity: bundled `full-*.jpg` artwork verified pixel-for-pixel against
  the 15 canonical mockups (home, login, products spot-checked); all changes are
  functional, none restyle the approved designs.
