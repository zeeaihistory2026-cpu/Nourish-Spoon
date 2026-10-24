# Android release

Current verified release: **1.0.0, Android build 32**, package `com.nourishspoon.app`.

[Download the current release](https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/tag/v1.0.0-build32).

APK SHA-256: `bde7be299d296182882a63953a159ba3e88b7cc1fbd795bcf529aa33389715c4`.

The APK passed archive integrity, signing, production-endpoint, bundled-source and 16 KB alignment checks. The signed APK uses the existing release certificate and was installed over the existing app without uninstalling. The installed APK and its Downloads copy match the verified public download.

Build 32 applies the approved More screen with aligned Dark Mode, Contact Us rows and matching Follow Us rows. Facebook and Instagram open the owner-provided brand profiles. TikTok keeps the same design with its destination deferred and no status text. Reviews remains in More and is removed from the burger menu. Notification previews remain in build 31, earlier profile/referral/order/logo previews in build 30 and full screen guides in build 29.

## Build and update compatibility

Keep the existing release signing key and package ID. Signing material and Firebase Android client configuration are ignored and provisioned outside Git. The committed `debug.keystore` is React Native's public development fixture, never the release signing identity.

Set `JAVA_HOME` to JDK 17 and run `scripts/build-android.ps1`. Native release output goes to ignored `artifacts/`. The script fixes the production API and rejects emulator configuration. Public version and `versionCode` are defined in `apps/mobile/app.json` and must match `android/app/build.gradle`. Always increase `versionCode` for an update, including when the public version stays `1.0.0`.

Release certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`.

## Download retention

Keep one current verified APK download on GitHub. Upload and verify its size/checksum before removing superseded APK assets, checksum sidecars and empty preview-release entries. Preserve source history and distinct original brand/design media. Release history records earlier states; they are not instructions for the current app.

Never commit APKs, AABs, private credentials, logs or build directories. `npm run audit:repo` enforces that boundary locally and in the [GitHub Actions quality workflow](../../.github/workflows/quality.yml). Dated notes remain in [history](history/README.md).
