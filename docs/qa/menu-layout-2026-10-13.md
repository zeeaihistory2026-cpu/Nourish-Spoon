# Menu, account and tracking review — 13 October 2026

The supplied HTML is used for grouped rows, profile actions and drawer spacing. Website tokens were checked on the live mobile website: cream #FDF6E3, forest #1B4332, gold #C9A84C; Cormorant Garamond headings and Jost body. The user later requested website menu colours, a shorter promo and removal of the explanatory footer. The existing Panjeeri image is retained byte-for-byte. Shop Now is directly below the banner copy. Its visual size is approximately 98x32px with extra touch padding. The promo is 160px high at normal text size; the explanatory footer is removed. No reference demo balance, version or additional inert links were copied.

More keeps one row each for orders, points, referral, wishlist, addresses, tracking and updates; duplicate counters under Edit Profile are removed. Burger remains for catalogue, story, reviews, delivery and payment information. TCS number entry and official tracking are embedded within the app. Courier data is not fabricated or treated as Nourish Spoon fulfilment data.

## Checks

- Mobile TypeScript check passed; admin TypeScript/Vite build passed.
- 13 domain/catalogue/reward pricing checks, 5 profile regressions, 6 rules/privacy checks and 6 callable integration checks passed (30 total).
- Integration covers 10% product promo, paid/delivered accrual, one-time referral, concurrent redemption, cancellation/restoration, refund reversal, owner-only configuration and private wallets.
- Real browser renders reviewed at 360x800 and 320x720; menu scrolling, Payment Methods, Shop Now, order history, wishlist, saved addresses, theme switching, tracking number validation and embedded TCS navigation checked.
- Blank sign-in fields show red field-specific feedback; email sign-in, logout and signed-out cart gating verified. After sign-in, the originally selected item appears in the home-accessible cart.
- No page/button opacity fade; the requested field validation shake remains. Auth fields stay white and the bottom auth food image is no longer bundled.

Get in Touch uses grouped contact rows; App Settings uses a single Dark Mode switch matching the layout reference.

## Limits

Screenshots use an isolated demo Firebase project and synthetic accounts, orders, points and consignment numbers. They are browser renders, not physical Android screenshots. Android release Kotlin compilation passed, including the WebView module. Production rewards/commerce deployment and native Google bridge remain pending Firebase owner CLI authorization. Apple additionally requires the owner's Apple Developer setup. No new APK is part of this layout preview.
