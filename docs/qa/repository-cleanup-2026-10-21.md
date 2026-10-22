# Repository cleanup

Started 21 October 2026; verification completed 22 October 2026.

## Scope

Preserve the recovered mobile and shared-backend fixes while making the repository easier to maintain. The mobile app lives in `apps/mobile`, the canonical dashboard in `apps/admin`, shared contracts in `packages`, backend transactions in `functions`, and development helpers in `tooling`.

Removed obsolete extraction and authentication smoke scripts, duplicated design images, derived product text, and an empty backend document. Archived 64 files (47,024,300 bytes) locally before removal, including 13 exact duplicate images. Original references remain under `docs/design/references`; older delivery notes live under `docs/releases/history`.

Import traversal reached all 83 mobile and 95 dashboard source modules. No active screen was removed. Public dashboard images that may be referenced by database content were retained.

## Maintenance safeguards

- Repository auditing rejects installers, generated output, private signing files, token-shaped credentials and inconsistent Android versions.
- Four regression tests exercise the audit, including deliberately staged APK and credential fixtures.
- Editor configuration, Node version, current architecture, backend setup and release-retention documentation describe the actual project.
- Dashboard export includes shared transactions and consistent repository hygiene files.
- The GitHub Actions workflow is prepared in `tooling/ci`; publishing it to the active workflow directory was rejected by GitHub because the stored credential lacks workflow write permission. Local checks passed; automatic GitHub execution is pending.
- Current installers and screen guides belong in GitHub Releases; source history and distinct original design media are preserved.

## Verification

`npm run check` passed: strict TypeScript checks, 62 mobile asset checks, 55 unit tests, Firebase Admin compatibility checks and the dashboard production build.

`npm run test:integration` passed against isolated Firebase emulators: 7 Firestore privacy tests, 6 callable transaction tests and 16 dashboard API tests. These cover customer ownership, optional tracking, order notifications, delegated administration, paid-only revenue reports and receipts. No production orders were created or modified for these checks.

The source snapshot is copied and byte-verified in an isolated Git checkout before publication. Repository auditing and `git diff --cached --check` run on that snapshot. The installed Android build remains version 1.0.0, build 29; this cleanup does not require a new mobile build.

These checks establish the tested behavior. They do not guarantee that every possible defect or dependency advisory has been eliminated.
