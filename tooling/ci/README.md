# GitHub Actions checks

The active workflow is [quality.yml](../../.github/workflows/quality.yml). It runs repository hygiene, TypeScript and asset checks, unit tests, dashboard and mobile web builds, and isolated Firebase integration tests with Node 22 and Java 21.

To run the same checks locally, use `npm run check`, `npm --prefix apps/mobile run build:web` and `npm run test:integration`. Changes to the workflow require GitHub **Workflows: Read and write** permission. Keep the workflow in `.github/workflows`; do not maintain a second template copy here.

Official setup actions are pinned to their release commit SHAs. When updating one, verify the official release and update both the SHA and its version comment.
