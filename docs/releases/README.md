# Android release

Current verified release: **1.0.0, Android build 30**, package `com.nourishspoon.app`.

[Download the current release](https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/tag/v1.0.0-build30).

APK SHA-256: `bdb28ea8dae67b3a5ec27b8f393bf5f4c34a7d1e1b2eeb8df50ebb01b1868beb`.

The APK passed archive integrity, signing, production-endpoint, bundled-source and 16 KB alignment checks. It uses the existing release certificate and a higher internal build number. It was installed over the existing app through USB, preserving app data. The copy saved in the phone’s Downloads folder has the same verified checksum.

This build updates the script wordmark beneath the unchanged native logo animation, the compact profile layout, the top notification bell, Refer & Earn and Order Details. Orders remains in the bottom bar. More contains Track Order, My Points, Wishlist, Saved Addresses, Refer & Earn, Reviews, Help & Support and Dark Mode. The new release includes individual previews; the earlier full screen guides remain archived with build 29.

## Build and update compatibility

Keep the existing release signing key and package ID. Signing material and Firebase Android client configuration are ignored and provisioned outside Git. The committed `debug.keystore` is React Native's public development fixture, never the release signing identity.

Set `JAVA_HOME` to JDK 17 and run `scripts/build-android.ps1`. Native release output goes to ignored `artifacts/`. The script fixes the production API and rejects emulator configuration. Public version and `versionCode` are defined in `apps/mobile/app.json` and must match `android/app/build.gradle`. Always increase `versionCode` for an update, including when the public version stays `1.0.0`.

Release certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`.

## Download retention

Keep one current verified APK download on GitHub. Upload and verify its size/checksum before removing superseded APK assets, checksum sidecars and empty preview-release entries. Preserve source history and distinct original brand/design media. Release history records earlier states; they are not instructions for the current app.

Never commit APKs, AABs, private credentials, logs or build directories. `npm run audit:repo` enforces that boundary locally and in the [GitHub Actions quality workflow](../../.github/workflows/quality.yml). Dated notes remain in [history](history/README.md).
