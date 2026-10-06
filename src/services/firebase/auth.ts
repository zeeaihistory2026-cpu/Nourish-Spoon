import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  updateProfile,
  type User,
} from '@react-native-firebase/auth';
import { doc, onSnapshot, setDoc } from '@react-native-firebase/firestore';

import type { UserProfile } from '../../types';
import { db, firebaseAuth } from './config';
import { serverTimestamp } from './firestore';

export function observeAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function signUpEmail(params: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<void> {
  const email = params.email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, params.password);
  const user = credential.user;

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName: params.fullName.trim(),
    email,
    ...(params.phone ? { phone: params.phone.trim() } : {}),
    city: '',
    role: 'customer',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  try {
    await updateProfile(user, { displayName: params.fullName.trim() });
  } catch {
    // Display name is cosmetic; the Firestore profile is the source of truth.
  }
}

export async function signInEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(firebaseAuth, email.trim().toLowerCase(), password);
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(firebaseAuth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(firebaseAuth, email.trim().toLowerCase());
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user || !user.email) {
    throw new Error('Not signed in');
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export function watchUserProfile(
  uid: string,
  onChange: (profile: UserProfile | null) => void
): () => void {
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(null);
        return;
      }
      const data = snapshot.data();
      if (!data || typeof data !== 'object') {
        onChange(null);
        return;
      }
      onChange({ ...data, uid: snapshot.id } as UserProfile);
    },
    () => onChange(null)
  );
}
