// Profile persistence regression checks; no network or real Firebase accounts.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("../apps/mobile/node_modules/typescript");

function profileService(write) {
  const storage = new Map();
  const source = path.resolve(
    __dirname,
    "../apps/mobile/src/services/firebase.ts",
  );
  const compiled = ts.transpileModule(fs.readFileSync(source, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const module = new Module(source);
  module.require = (name) => {
    if (name === "firebase/app") return { getApps: () => [{}] };
    if (name === "firebase/auth") return { initializeAuth: () => ({}) };
    if (name === "firebase/firestore")
      return {
        getFirestore: () => ({}),
        doc: () => "users/customer",
        serverTimestamp: () => "server-time",
        setDoc: write,
      };
    if (name === "firebase/functions") return {};
    if (name === "react-native") return { Platform: { OS: "web" } };
    if (name === "@react-native-async-storage/async-storage")
      return {
        getItem: async (key) => storage.get(key) ?? null,
        setItem: async (key, value) => storage.set(key, value),
        removeItem: async (key) => storage.delete(key),
      };
    throw Error(`Unexpected dependency: ${name}`);
  };
  const previous = { ...process.env };
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY = "test";
  process.env.EXPO_PUBLIC_FIREBASE_APP_ID = "test";
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = "test";
  delete process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
  try {
    module._compile(compiled, source);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in previous)) delete process.env[key];
    Object.assign(process.env, previous);
  }
  return { ...module.exports, storage };
}

test("saving a name before phone loading preserves the stored number", async () => {
  const server = { phone: "03001234567" };
  const service = profileService(async (_, data, options) => {
    assert.equal(options.merge, true);
    assert.equal(Object.hasOwn(data, "phone"), false);
    Object.assign(server, data);
  });
  await service.saveCustomerProfile(
    "customer",
    "Updated name",
    "customer@example.invalid",
  );
  assert.equal(server.phone, "03001234567");
  assert.equal(server.fullName, "Updated name");
});

test("an explicitly cleared optional phone is saved as empty", async () => {
  let saved;
  const service = profileService(async (_, data) => {
    saved = data;
  });
  await service.saveCustomerProfile(
    "customer",
    "Customer",
    "customer@example.invalid",
    "",
  );
  assert.equal(saved.phone, "");
  assert.equal(service.storage.size, 0);
});

test("name-only edits retain a queued phone after a failed save", async () => {
  let saved;
  const service = profileService(async (_, data) => {
    saved = data;
  });
  service.storage.set(
    "nourish:profile:customer",
    JSON.stringify({ phone: "03111234567" }),
  );
  await service.saveCustomerProfile(
    "customer",
    "Customer",
    "customer@example.invalid",
  );
  assert.equal(saved.phone, "03111234567");
});

test("failed writes remain queued and can be retried", async () => {
  let failed = true,
    saved;
  const service = profileService(async (_, data) => {
    if (failed) throw Error("offline");
    saved = data;
  });
  await assert.rejects(
    service.saveCustomerProfile(
      "customer",
      "Customer",
      "customer@example.invalid",
      "03111234567",
    ),
  );
  assert.equal(service.storage.size, 1);
  failed = false;
  await service.syncPendingCustomerProfile("customer");
  assert.equal(saved.phone, "03111234567");
  assert.equal(service.storage.size, 0);
});

test("an older completed write cannot erase a newer pending profile", async () => {
  const completions = [];
  const service = profileService(
    () => new Promise((resolve) => completions.push(resolve)),
  );
  const older = service.saveCustomerProfile(
    "customer",
    "Older",
    "customer@example.invalid",
    "03001234567",
  );
  await new Promise((resolve) => setImmediate(resolve));
  const newer = service.saveCustomerProfile(
    "customer",
    "Newer",
    "customer@example.invalid",
    "03111234567",
  );
  await new Promise((resolve) => setImmediate(resolve));
  completions[0]();
  await older;
  assert.equal(
    JSON.parse(service.storage.get("nourish:profile:customer")).fullName,
    "Newer",
  );
  completions[1]();
  await newer;
  assert.equal(service.storage.size, 0);
});
