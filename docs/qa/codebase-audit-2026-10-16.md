# Codebase audit — 16 October 2026

## Scope and result

Reviewed the Nourish Spoon customer app/web storefront, owner dashboard, shared catalogue and types, Firebase commerce/reward functions, Firestore rules, hosted sign-in bridge, build configuration, assets and developer checks. Changes are local; this audit does not certify the deployed Firebase project or activate paid services.

The untracked `Noor-Ai/` project and pre-existing edits to both native launch icon XML files were preserved. Design originals, catalogue source material, font licences and historical release notes remain because they support maintenance and provenance. The native launch plugin still consumes Great Vibes, so that font is not dead code.

## Findings addressed

| Priority | Finding | Change |
| --- | --- | --- |
| High | Persisted baskets had no account owner, favourites survived account changes, and cold starts could restore another account's shopping data. | Persist the owner UID, coordinate authentication with storage hydration, and clear cart, favourites and checkout draft when ownership changes. Version-0 baskets are cleared once because their owner cannot be established. |
| High | The dashboard could accept an outdated asynchronous token result after an account change. | Separate session hook resets access immediately, handles token refreshes and rejects stale async results. Data listeners are scoped to the authorized UID and disposed on changes. Server/rules authorization remains required. |
| Medium | Cart and checkout did not consistently prevent inactive sizes or quantities exceeding current stock. | Shared cart validation checks current records, per-size stock and legacy stock shared across sizes. Stock changes block checkout with a specific explanation; quantities can still be reduced. |
| Medium | Product detail and WhatsApp selection could retain an inactive size or stale price. | Select active sizes, disable sold-out actions, filter dropdowns and resolve current catalogue prices before building the WhatsApp message. |
| Medium | Unavailable commerce features and an unconfigured Apple provider appeared as usable actions. | Hide inactive rewards/promos, show WhatsApp checkout when commerce is disabled, and require an explicit tested Apple web-provider flag. |
| Medium | Admin offered invalid stage jumps, refunded-payment reopening and invalid delivery/tracking inputs. | Offer the current/next valid stage plus cancellation; terminal orders stay terminal. Validate delivery fees and 8–20 digit tracking numbers in the editor. Server validation remains authoritative. |
| Medium | Checkout arithmetic could exceed JavaScript's exact integer range. | Reject unsafe line totals, subtotals and delivery totals, with a regression test. |
| Medium | Strict typing and unused-code checks were disabled. | Enable strict TypeScript and unused local/parameter checks for both apps; add explicit environment type dependency and remove confirmed unused imports, duplicate theme state, obsolete order/theme types and redundant navigation props. |
| Medium | The hosted sign-in return link's CSS could override its hidden state, and sign-in was clickable during initialization. | Enforce hidden elements, enable sign-in only after initialization and add keyboard focus styling. |
| Low | Mobile layouts stretched across desktop windows; some images used viewport width instead of their actual container. | Center a bounded web app shell and use image aspect ratios. Enlarge compact favourite targets and give touch controls a default button role. |
| Low | Dashboard lacked hierarchy, search and clear loading/error/success states. | Refresh responsive styling, semantic navigation and skip link; add overview counts, order search/status filtering and recent history loading in batches of 100 with a Load older orders action. |
| Low | Barrel icon imports included unused icon font families in the export. | Import each used icon family directly. The measured web export fell from 82 to 66 assets, 548 to 502 modules, and approximately 2.3 MB to 2.1 MB of JavaScript. |
| Low | Old generated artwork and duplicate asset references obscured the maintained structure. | Remove unused login artwork and obsolete extraction targets; replace old dashboard stylesheet, remove redundant asset aliases and preserve sources used by native plugins. |
| Low | A blanket no-refined-sugar story claim conflicted with the sugar recipe. | Describe the available recipe options consistently in the screen and shared story data. |

## Verification

- `npm run check`: strict type checks for both apps, backend/shared regression tests and dashboard production build.
- `npm --prefix apps/mobile run build:web`: production Expo web export.
- Regression suite: 27 tests covering catalogue adaptation, profile persistence, pricing, quantities, stock, fulfilment, discounts, account-owned baskets and hydration migration.
- Browser review: home, categories, product search and no-results state, detail/size selection, add-to-cart account gate, empty sign-in validation and dashboard sign-in. The compiled storefront was additionally checked at 320 px, 390 px and desktop widths; the narrow screens had no horizontal page overflow. Inactive rewards and Apple sign-in were confirmed absent from the compiled UI. Screenshots are saved under the ignored `artifacts/audit/` folder. Authenticated owner writes and actual ordering are not certified by those browser checks.
- `git diff --check` and hosted JavaScript syntax validation.

Run the final checks after installing dependencies in each package; the repository root now exposes `typecheck`, `test` and `check`. GitHub Actions runs those checks and the storefront export on pushes and pull requests. This adds a workflow file; it does not prove a remote CI run passed.

## Remaining risks and release requirements

1. **Emulator integration blocked locally.** The installed Java 17 runtime is rejected by Firebase CLI, which requires Java 21+. Install/select a supported JDK, then run the existing Firestore-rule and commerce integration suites against `demo-nourish-spoon`. No production fixtures or orders were created by this audit.
2. **Dependencies are not all clear.** Dashboard audit reports zero vulnerabilities after overriding Firestore's transitive gRPC dependency to patched `1.14.6`. The same targeted fix is applied to the storefront. Compatible automatic fixes were applied; no forced framework downgrade or backend major upgrade was made.
3. **Storefront tooling advisories remain.** npm reports 23 affected dependency entries (16 high, 7 moderate), rooted in `braces`, `node-forge` and `uuid` through Expo/Metro/Xcode. These counts include inherited dependency findings. npm's suggested forced resolution downgrades Expo to 44, which is unsuitable for this SDK 57 app. Resolve through tested supported upstream upgrades; do not equate toolchain advisories with a demonstrated browser exploit.
4. **Backend dependency upgrade remains.** npm reports 8 moderate affected entries through `uuid` and Google Cloud dependencies. The suggested fix upgrades `firebase-admin` to 14.5.0, a major change. That upgrade needs the Node 22 runtime and successful emulator integration validation. Local unit/build checks used the installed Node 24 runtime; deployed functions still target Node 22.
5. **Live services need separate verification.** Existing deployment notes say Cloud Functions remain undeployed and live rules may differ from the repository. Billing, provider setup, owner permissions, payment confirmation and a real order lifecycle require their deployment prerequisites. This audit did not change live rules, deploy or enable billing.
6. **Performance work remains.** The dashboard still emits Vite's large-chunk advisory because Firebase is substantial. Rewards are loaded separately. Hero/product raster artwork is also large; measure network loading and compress with visual QA before release. A successful export is not a Lighthouse score or a native APK build.
7. **Terms/privacy content remains a release requirement.** The customer signup screen still directs users to contact the business for current terms/privacy wording. Obtain approved policy content and publish/link it before launch; this audit does not invent legal terms.

Advisories: [gRPC certificate context](https://github.com/advisories/GHSA-m9gg-hp2v-232j), [UUID buffer bounds](https://github.com/advisories/GHSA-w5hq-g745-h8pq), [braces nested patterns](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [node-forge verification](https://github.com/advisories/GHSA-86w9-cpqp-85rv).
