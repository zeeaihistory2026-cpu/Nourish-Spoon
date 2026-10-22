# Quality and authoring tools

The tests use the `demo-nourish-spoon` emulator project and reject a production database. Start from the repository root:

```sh
npm test
npm run audit:repo
npm run audit:assets
npm run test:integration
```

`npm test` covers checkout, stock, catalogue caching, accounts, rewards, reviews, notifications and financial calculations. Integration checks require Java 21 and exercise Auth, Firestore rules, callable functions and dashboard API routes.

`seed-emulator.cjs` creates demonstration records only. Test accounts use `.invalid` addresses. Do not copy emulator fixtures into production.

`artwork/` contains optional brand-vector regeneration tools; Python tools require Pillow and NumPy. `previews/` builds galleries from captured application screens. They are not run during app startup or deployment. Generated previews belong in ignored `artifacts/` or `output/` directories.

[CI setup](ci/README.md) contains the prepared GitHub Actions workflow and the permission needed to enable it.
