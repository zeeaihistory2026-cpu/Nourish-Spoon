# Nourish Spoon 1.0.6 preview

## Changes

- Required checkout, saved-address, profile-name, WhatsApp order, tracking, referral and review inputs use inline red errors and a brief shake. Invalid page forms scroll back to the fields. Optional profile phone and gift messages remain optional.
- Android Google sign-in uses the native account picker and Firebase ID-token credential sign-in. The APK signing SHA-1 and SHA-256 are registered with the existing Firebase Android app. Google OAuth is enabled. Physical Google-account selection still requires a device check.
- Startup logo no longer scales, and its overlay is attached to the window independently of React layout. The private customer video is excluded from previews and source control.
- More places one edit pencil beside the name, Dark Mode below its navigation group, and compact WhatsApp/Call/Email actions immediately above Sign Out.
- Cart shows PROMO10 near the order summary; the checkout offers card retains server validation and never invents a discount.
- Panjeeri cards now show the twelve ingredients published by the website, with the selected catalogue recipe's khoya and sugar option. Legacy generic ingredient cards upgrade without overriding server prices or availability.

## Live services

The owner requested that Firebase billing stay disabled. Cloud Functions have not been deployed: online order placement, loyalty earning/redemption, referral bonuses and promo validation are inactive. The release explicitly marks offers and rewards as awaiting activation and keeps WhatsApp checkout available. Set EXPO_PUBLIC_COMMERCE_ENABLED=true only after deploying the secure functions. The configured program is 1 point per Rs.100, 100 points = Rs.100, a 200-point referral bonus, and PROMO10 at 10% off products, excluding delivery. Earning and referral bonuses require a paid and delivered order.

Apple sign-in remains awaiting an Apple Developer account and provider setup. The Apple button explains this instead of reporting a completed sign-in.

## Validation

Mobile TypeScript and web export passed. Existing profile persistence, Firestore privacy, order/promo/reward transaction tests passed (30 cases), plus the Panjeeri placeholder migration regression (31 total). Screens are actual 360px/320px browser renders with isolated demo accounts. They do not prove native Google account selection, Android launch behavior, or installation on the customer's Realme device. APK assembly, fatal lint, signatures, archive integrity, release configuration and native alignment are checked before publication.
