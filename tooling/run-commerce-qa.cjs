const fs = require("node:fs");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const port = 3002;
const origin = `http://localhost:${port}`;
const env = {
  ...process.env,
  FIREBASE_PROJECT_ID: "demo-nourish-spoon",
  FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
  FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-nourish-spoon",
  NEXT_PUBLIC_FIREBASE_API_KEY: "demo-key",
  NEXT_PUBLIC_FIREBASE_APP_ID: "demo-app",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-nourish-spoon.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
  NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
  ADMIN_EMAILS: "info@nourishspoon.com",
  NOURISH_QA_ORIGIN: origin,
};

async function run() {
  // This runner must be invoked by emulators:exec, never against the live project.
  if (
    process.env.GCLOUD_PROJECT !== "demo-nourish-spoon" ||
    !process.env.FIRESTORE_EMULATOR_HOST
  )
    throw Error(
      "Start the isolated demo Firebase emulators before running commerce QA.",
    );
  fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
  const log = fs.openSync(path.join(root, "artifacts/qa-dashboard.log"), "w");
  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--port", String(port)],
    {
      cwd: path.join(root, "apps/admin"),
      env,
      stdio: ["ignore", log, log],
      windowsHide: true,
      detached: process.platform !== "win32",
    },
  );
  let serverError;
  server.on("error", (error) => {
    serverError = error;
  });
  try {
    const deadline = Date.now() + 120000;
    let ready = false;
    while (Date.now() < deadline) {
      if (serverError) throw serverError;
      if (server.exitCode !== null)
        throw Error("QA dashboard exited; see artifacts/qa-dashboard.log.");
      try {
        const response = await fetch(origin + "/api/health", {
          signal: AbortSignal.timeout(10000),
        });
        const health = await response.json();
        if (health.projectId !== "demo-nourish-spoon")
          throw Error("Unexpected QA database.");
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {
        /* Wait for the local Next server to finish startup. */
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready) throw Error("QA dashboard did not become ready.");
    for (const file of [
      "firestore.test.mjs",
      "commerce.test.mjs",
      "dashboard-commerce.test.mjs",
    ]) {
      const status = await new Promise((resolve, reject) => {
        const test = spawn(
          process.execPath,
          ["--test", path.join("tooling", file)],
          { cwd: root, env, stdio: "inherit", windowsHide: true },
        );
        test.on("error", reject);
        test.on("close", resolve);
      });
      if (status !== 0) throw Error(`${file} failed.`);
    }
  } finally {
    if (process.platform === "win32")
      spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
        windowsHide: true,
        stdio: "ignore",
      });
    else {
      try {
        process.kill(-server.pid, "SIGTERM");
      } catch {}
    }
    fs.closeSync(log);
  }
}
run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
