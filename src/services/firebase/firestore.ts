import {
  serverTimestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QuerySnapshot,
} from '@react-native-firebase/firestore';

export { serverTimestamp };

export function docToEntity<T>(
  snapshot: DocumentSnapshot<DocumentData, DocumentData>
): T | null {
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data();
  if (!data || typeof data !== 'object') {
    return null;
  }
  return { id: snapshot.id, ...data } as T;
}

export function docsToEntities<T>(
  snapshots: QuerySnapshot<DocumentData, DocumentData>
): T[] {
  return snapshots.docs.reduce<T[]>((list, doc) => {
    const entity = docToEntity<T>(doc);
    if (entity) {
      list.push(entity);
    }
    return list;
  }, []);
}
