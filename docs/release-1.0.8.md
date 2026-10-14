# Nourish Spoon 1.0.8 (Android version code 9)

The opening logo draws into view once, without fading or erasing, at a fixed size and position, before opening the first app page. The native view draws the complete gold vector artwork on a steady cream background. The Android starting window uses the same cream so no full logo flashes and disappears before drawing. The artwork stays inside Android’s circular launch mask, including the trademark. No zoom, translation, carousel or unrelated screen changes are included.

The animation runs in the native launch overlay, independent of React initialization. The first destination can prepare underneath it; the overlay is removed only after both the full drawing and destination render. If Android system animations are disabled, the complete static logo is used. The animation is cancelled when its view detaches.

The owner-approved Firebase account has an admin claim. Firestore rules were compiled and deployed after explicit owner approval. The local owner dashboard is http://127.0.0.1:8124/ while its Vite server runs on this computer. There is no public dashboard deployment. Cloud Functions, secure online orders, reward settlement and promo validation remain inactive with billing disabled.

Verification: mobile TypeScript; native/plugin template consistency; all 64 vector paths agree between the static and animated artwork; the largest stroke radius is 91.78dp within Android’s 96dp mask; production release assembly, fatal lint, APK signatures, package/version, signing-certificate continuity and 16KB native alignment are checked before delivery. Browser preview represents the motion; a physical Android launch test is not available in this workspace.
