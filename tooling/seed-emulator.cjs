// Local QA fixtures only. Refuses to run against a real Firebase project.
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
const functionsRequire = require("node:module").createRequire(
  require("node:path").resolve(__dirname, "../functions/package.json"),
);
const { initializeApp } = functionsRequire("firebase-admin/app");
const { getFirestore } = functionsRequire("firebase-admin/firestore");
const { getAuth } = functionsRequire("firebase-admin/auth");
const fs = require("node:fs"),
  Module = require("node:module");
const ts = require("../apps/mobile/node_modules/typescript");
const path = require("node:path");
async function seed() {
  const app = initializeApp({ projectId: "demo-nourish-spoon" }, "qa-fixtures");
  const db = getFirestore(app),
    auth = getAuth(app);
  const sourcePath = path.resolve(
    __dirname,
    "../packages/catalog/websiteSnapshot.ts",
  );
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      resolveJsonModule: true,
      esModuleInterop: true,
    },
  }).outputText;
  const snapshot = new Module(sourcePath);
  snapshot.filename = sourcePath;
  snapshot.paths = Module._nodeModulePaths(path.dirname(sourcePath));
  snapshot._compile(compiled, sourcePath);
  for (const product of snapshot.exports.INITIAL_PRODUCTS)
    await db.doc(`products/${product.id}`).set(product);
  await db
    .doc("settings/commerce")
    .set({
      delivery_fees: { tcs_nationwide: 250, sargodha_sameday: 150 },
      first_order_free_delivery: false,
    });
  for (const [uid, email, owner] of [
    ["qa-customer", "customer@example.invalid", false],
    ["qa-owner", "info@nourishspoon.com", true],
  ]) {
    try {
      await auth.createUser({
        uid,
        email,
        emailVerified: true,
        password: "NourishQA!2026",
        displayName: owner ? "QA Owner" : "QA Customer",
      });
    } catch (error) {
      if (
        error.code !== "auth/uid-already-exists" &&
        error.code !== "auth/email-already-exists"
      )
        throw error;
    }
    if (owner) await auth.setCustomUserClaims(uid, { admin: true });
    await db
      .doc(`users/${uid}`)
      .set({
        uid,
        fullName: owner ? "QA Owner" : "QA Customer",
        email,
        phone: "03001234567",
        role: "customer",
      });
  }
  console.log(
    "Isolated demo project seeded. Delivery fees are test fixtures, not production business rates.",
  );
  return app;
}
module.exports = { seed };
if (require.main === module)
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
