const { initializeApp, cert } = require('firebase-admin/app');
const credentials = require('./serviceAccountKey.json');
const app = initializeApp({ credential: cert(credentials) });

async function main() {
  const token = (await app.options.credential.getAccessToken()).access_token;
  const res = await fetch(
    'https://serviceusage.googleapis.com/v1/projects/nourish-spoon/services/firestore.googleapis.com:enable',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'x-goog-user-project': 'nourish-spoon' },
      body: '{}',
    }
  );
  console.log('STATUS', res.status);
  console.log((await res.text()).slice(0, 600));
  process.exit(0);
}
main();
