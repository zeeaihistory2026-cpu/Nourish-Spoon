# Android release

Current verified release: **1.0.0, Android build 31**, package `com.nourishspoon.app`.

[Download the current release](https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/tag/v1.0.0-build31).

APK SHA-256: `5cf77a94f082be127dc0bf3f3526ab782e76c56207489dcdfbfb3f0c0b43f98f`.

The APK passed archive integrity, signing, production-endpoint, bundled-source and 16 KB alignment checks. It uses the existing release certificate and a higher internal build number. Android confirmed build 31 installed over the existing app through USB. The installed APK, Downloads copy and public download have the same verified checksum.

Build 31 matches the notification reference using the app’s forest green, cream and gold colors. It adds a live current-order card, truthful historical activity, unread count and account-scoped Mark all read. Announcements stay visible. Narrow layouts, dark mode, empty inbox and order navigation were checked with isolated data. The build 30 release retains profile, referral, order-details and logo previews; full screen guides remain archived with build 29.

## Build and update compatibility

Keep the existing release signing key and package ID. Signing material and Firebase Android client configuration are ignored and provisioned outside Git. The committed `debug.keystore` is React Native's public development fixture, never the release signing identity.

Set `JAVA_HOME` to JDK 17 and run `scripts/build-android.ps1`. Native release output goes to ignored `artifacts/`. The script fixes the production API and rejects emulator configuration. Public version and `versionCode` are defined in `apps/mobile/app.json` and must match `android/app/build.gradle`. Always increase `versionCode` for an update, including when the public version stays `1.0.0`.

Release certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`.

## Download retention

Keep one current verified APK download on GitHub. Upload and verify its size/checksum before removing superseded APK assets, checksum sidecars and empty preview-release entries. Preserve source history and distinct original brand/design media. Release history records earlier states; they are not instructions for the current app.

Never commit APKs, AABs, private credentials, logs or build directories. `npm run audit:repo` enforces that boundary locally and in the [GitHub Actions quality workflow](../../.github/workflows/quality.yml). Dated notes remain in [history](history/README.md).
