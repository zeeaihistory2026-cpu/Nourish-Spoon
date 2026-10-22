# Android release

Current verified release: **1.0.0, Android build 29**, package `com.nourishspoon.app`.

[Download the current release](https://github.com/zeeaihistory2026-cpu/Nourish-Spoon/releases/tag/v1.0.0-build29).

APK SHA-256: `9ef4c1eaefc3fa7302292ae9f36bf4f64a67a7dfe02727f1a1b9504d68e282b9`.

The APK passed archive integrity, signing, production-endpoint, bundled-source and 16 KB alignment checks. It was installed over the existing app through USB without uninstalling, and an identical APK was saved in the phone's Downloads folder.

## Build and update compatibility

Keep the existing release signing key and package ID. Signing material and Firebase Android client configuration are ignored and provisioned outside Git. The committed `debug.keystore` is React Native's public development fixture, never the release signing identity.

Set `JAVA_HOME` to JDK 17 and run `scripts/build-android.ps1`. Native release output goes to ignored `artifacts/`. The script fixes the production API and rejects emulator configuration. Public version and `versionCode` are defined in `apps/mobile/app.json` and must match `android/app/build.gradle`. Always increase `versionCode` for an update, including when the public version stays `1.0.0`.

Release certificate SHA-256: `066eff75865521f7323cdcb57f313ec99d22d8acee3459409980f31600e51bb0`.

## Download retention

Keep one current verified APK download on GitHub. Upload and verify its size/checksum before removing superseded APK assets, checksum sidecars and empty preview-release entries. Preserve source history and distinct original brand/design media. Release history records earlier states; they are not instructions for the current app.

Never commit APKs, AABs, private credentials, logs or build directories. `npm run audit:repo` enforces that boundary locally. The prepared [quality-check workflow](../../tooling/ci/README.md) needs GitHub workflow write permission before automatic checks can be enabled. Dated notes remain in [history](history/README.md).
