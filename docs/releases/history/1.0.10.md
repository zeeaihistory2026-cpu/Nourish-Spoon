# Nourish Spoon 1.0.10 - Script launch wordmark

The native launch screen finishes forming the HD gold mark first, then reveals bold "Nourish Spoon" script letter by letter over one second. Great Vibes Regular is emboldened by Android's text renderer to retain its script design. It is a close visual match to the owner's October 15 lettering reference; the supplied image does not establish the original typeface's exact identity. Other app typography and screens are unchanged.

The complete phrase determines the alignment from the first frame. Android retains the full shaping context while revealing letters, so the script stays in place rather than recentering each prefix. The vector draw finishes at 1.4 seconds; the name is revealed from 1.4 to 2.4 seconds, followed by a 0.6-second hold. The overlay completes at three seconds. There is no fade, zoom or erase animation. Reduced-motion settings display both the completed mark and name immediately.

The bundled, unmodified Great Vibes font is redistributed under the SIL Open Font License. The native-launch plugin installs the font and its license into Android resources; neither network access nor React font loading is needed for startup. See `apps/mobile/assets/fonts/README.md` for source attribution.

Release verification covers native assembly, fatal lint, package/version, signing continuity, resource integrity and native alignment. A matching-font HD animation preview accompanies the APK. Physical startup acceptance remains unverified for this release because no phone was connected during its build.

Billing and backend/provider activation status are unchanged. Secure commerce remains disabled in the production build.
