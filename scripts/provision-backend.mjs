// One-shot backend provisioning using the service account key.
// Registers the Android app, writes the real google-services.json, creates the
// Firestore database, enables email/password sign-in, deploys the security
// rules, and creates the composite indexes.
// Usage: node scripts/provision-backend.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { initializeApp, cert } = require('firebase-admin/app');

const PROJECT_ID = 'nourish-spoon';
const PACKAGE_NAME = 'com.nourishspoon.app';

const serviceAccount = JSON.parse(await readFile('./serviceAccountKey.json', 'utf8'));
const app = initializeApp({ credential: cert(serviceAccount) });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function accessToken() {
  const credential = app.options.credential;
  const result = await credential.getAccessToken();
  return result.access_token;
}

const token = await accessToken();
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'x-goog-user-project': PROJECT_ID };

async function call(url, method = 'GET', body) {
  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // non-JSON response
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${method} ${url} → ${text.slice(0, 300)}`);
  }
  return json;
}

// 0. Activate the Google APIs the app backend needs (normally triggered by the
//    first console visit; safe to call repeatedly).
console.log('→ Activating Google APIs...');
const REQUIRED_APIS = [
  'firebase.googleapis.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'firebaserules.googleapis.com',
  'firebaseinstallations.googleapis.com',
  'fcm.googleapis.com',
];
for (const service of REQUIRED_APIS) {
  try {
    await call(`https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/${service}:enable`, 'POST', {});
    console.log(`  ✓ ${service}`);
  } catch (error) {
    if (!/409|already enabled/i.test(String(error.message))) {
      console.log(`  ! ${service} → ${String(error.message).slice(0, 110)}`);
    } else {
      console.log(`  ✓ ${service} (already enabled)`);
    }
  }
}
// Give the activation a moment to propagate.
await sleep(15000);

// 1. Register the Android app (or reuse the existing one).
console.log('→ Registering Android app...');
let androidApp = null;
const list = await call(`https://firebase.googleapis.com/v1/projects/${PROJECT_ID}/androidApps`);
androidApp = (list.apps ?? []).find((entry) => entry.packageName === PACKAGE_NAME) ?? null;
if (!androidApp) {
  const operation = await call(`https://firebase.googleapis.com/v1/projects/${PROJECT_ID}/androidApps`, 'POST', {
    displayName: 'Nourish Spoon',
    packageName: PACKAGE_NAME,
  });
  for (let attempt = 0; attempt < 30; attempt++) {
    const status = await call(`https://firebase.googleapis.com/v1/${operation.name}`);
    if (status.done) {
      androidApp = status.response;
      break;
    }
    await sleep(3000);
  }
  if (!androidApp) throw new Error('Android app registration did not finish in time');
}
console.log(`  ✓ Android app registered (${androidApp.appId})`);

// 2. Download the real google-services.json.
const config = await call(
  `https://firebase.googleapis.com/v1/projects/${PROJECT_ID}/androidApps/${androidApp.appId}/config`
);
await writeFile('google-services.json', Buffer.from(config.configFileContents, 'base64'));
console.log('  ✓ google-services.json written to project root');

// 3. Create the Firestore database if it does not exist yet.
console.log('→ Creating Firestore database...');
try {
  await call(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases?databaseId=%28default%29`,
    'POST',
    { type: 'FIRESTORE_NATIVE', locationId: 'asia-south1' }
  );
  console.log('  ✓ Firestore database created (asia-south1)');
} catch (error) {
  if (/409|already exists/i.test(String(error.message))) {
    console.log('  ✓ Firestore database already exists');
  } else {
    throw error;
  }
}

// 4. Enable email/password sign-in.
console.log('→ Enabling email/password sign-in...');
await call(
  `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config?updateMask=signUpConfig`,
  'PATCH',
  { signUpConfig: { allowPasswordSignup: true } }
);
console.log('  ✓ Email/password sign-in enabled');

// 5. Deploy the Firestore security rules.
console.log('→ Deploying Firestore security rules...');
const rulesContent = await readFile('firestore.rules', 'utf8');
const ruleset = await call(`https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`, 'POST', {
  source: { files: [{ name: 'firestore.rules', content: rulesContent }] },
});
await call(`https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/cloud.firestore`, 'PATCH', {
  rulesetName: ruleset.name,
});
console.log('  ✓ Security rules deployed');

// 6. Create the composite indexes (builds continue in the background on Google's side).
console.log('→ Creating composite indexes...');
const indexConfig = JSON.parse(await readFile('firestore.indexes.json', 'utf8'));
let created = 0;
for (const index of indexConfig.indexes ?? []) {
  const fields = index.fields
    .map((field) => ({
      fieldPath: field.fieldPath,
      ...(field.order ? { order: field.order } : {}),
      ...(field.arrayConfig ? { arrayConfig: field.arrayConfig } : {}),
    }))
    .filter((field) => field.order || field.arrayConfig);
  try {
    await call(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/%28default%29/indexes`,
      'POST',
      { queryScope: index.queryScope, fields }
    );
    created++;
  } catch (error) {
    if (!/409|already exists/i.test(String(error.message))) {
      console.log(`  ! index skipped: ${String(error.message).slice(0, 120)}`);
    }
  }
}
console.log(`  ✓ ${created} composite indexes requested`);

console.log('\nPROVISIONING COMPLETE');
process.exit(0);
