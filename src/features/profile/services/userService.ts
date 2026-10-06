import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';

import { db } from '../../../services/firebase/config';
import { docToEntity, docsToEntities, serverTimestamp } from '../../../services/firebase/firestore';
import type { Address, AppNotification, UserProfile } from '../../../types';

export async function saveProfile(
  uid: string,
  data: { fullName: string; phone: string; city: string }
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

export async function fetchAddresses(uid: string): Promise<Address[]> {
  const snapshot = await getDocs(collection(doc(db, 'users', uid), 'addresses'));
  const addresses = docsToEntities<Address>(snapshot);
  return addresses.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

export async function saveAddress(uid: string, address: Omit<Address, 'id'>): Promise<string> {
  const addresses = collection(doc(db, 'users', uid), 'addresses');
  const reference = doc(addresses);
  const batch = writeBatch(db);
  batch.set(reference, { ...address, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

  if (address.isDefault) {
    const existing = await getDocs(query(addresses, where('isDefault', '==', true)));
    existing.docs.forEach((docSnapshot) => {
      if (docSnapshot.id !== reference.id) {
        batch.update(docSnapshot.ref, { isDefault: false });
      }
    });
  }

  await batch.commit();
  return reference.id;
}

export async function deleteAddress(uid: string, addressId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'addresses', addressId));
}

export async function fetchNotifications(uid: string, limitValue = 30): Promise<AppNotification[]> {
  const snapshot = await getDocs(
    query(
      collection(db, 'notifications'),
      where('recipientUid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(limitValue)
    )
  );
  return docsToEntities<AppNotification>(snapshot);
}

export async function markNotificationsRead(uid: string): Promise<void> {
  const snapshot = await getDocs(
    query(
      collection(db, 'notifications'),
      where('recipientUid', '==', uid),
      where('read', '==', false),
      limit(50)
    )
  );
  if (snapshot.empty) {
    return;
  }
  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnapshot) => batch.update(docSnapshot.ref, { read: true }));
  await batch.commit();
}

export async function fetchActiveCouponCount(): Promise<number> {
  try {
    const snapshot = await getCountFromServer(
      query(collection(db, 'coupons'), where('isActive', '==', true))
    );
    return snapshot.data().count;
  } catch {
    return 0;
  }
}

export async function fetchProfileOnce(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return docToEntity<UserProfile>(snapshot);
}
