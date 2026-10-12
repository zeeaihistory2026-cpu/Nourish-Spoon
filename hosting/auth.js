import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, inMemoryPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-functions.js';
const params = new URLSearchParams(location.search), provider = params.get('provider'), challenge = params.get('challenge'), state = params.get('state');
const button = document.querySelector('#signin'), message = document.querySelector('#message'), returnLink = document.querySelector('#return');
let app;
try {
  if (!['google','apple'].includes(provider) || !/^[a-f0-9]{64}$/.test(challenge || '') || !/^[a-f0-9-]{36}$/.test(state || '')) throw new Error('Open sign-in from the Nourish Spoon app.');
  const response = await fetch('/__/firebase/init.json');
  if (!response.ok) throw new Error('Sign-in is unavailable. Please try email sign-in in the app.');
  app = initializeApp(await response.json());
  await setPersistence(getAuth(app), inMemoryPersistence);
  button.textContent = `Continue with ${provider === 'google' ? 'Google' : 'Apple'}`;
} catch (error) { message.textContent = error.message; button.disabled = true; }
button.addEventListener('click', async () => {
  button.disabled = true; message.textContent = 'Opening secure sign-in…';
  try {
    const oauth = provider === 'google' ? new GoogleAuthProvider() : new OAuthProvider('apple.com');
    await signInWithPopup(getAuth(app), oauth);
    const result = await httpsCallable(getFunctions(app, 'us-central1'), 'issueNativeSession')({ challenge });
    // Only an expiring, one-use code travels through the deep link. Redemption requires the app's secret verifier.
    returnLink.href = `nourishspoon://auth?code=${encodeURIComponent(result.data.code)}&state=${encodeURIComponent(state)}`;
    returnLink.hidden = false; message.textContent = 'Signed in. Return to your app to finish.';
    returnLink.click();
  } catch (error) {
    message.textContent = error.code === 'auth/operation-not-allowed' ? 'This provider is not enabled yet. Please use email sign-in in the app.' : 'Sign-in did not complete. Please try again or use email sign-in.';
    button.disabled = false;
  }
});
