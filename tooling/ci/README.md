# GitHub Actions setup

`quality.yml` runs the repository audit, TypeScript and asset checks, unit tests, dashboard and mobile web builds, and isolated Firebase integration tests with Node 22 and Java 21.

The complete checks passed locally on 22 October 2026. Automatic GitHub execution is pending: GitHub rejected writing `.github/workflows/quality.yml` with the stored credential. The same credential can publish ordinary source and Releases.

To enable the workflow, grant the repository credential **Workflows: Read and write**, then move `tooling/ci/quality.yml` to `.github/workflows/quality.yml` and commit it. Keep a single copy. Until then, run `npm run check`, `npm --prefix apps/mobile run build:web` and `npm run test:integration` before publishing.
