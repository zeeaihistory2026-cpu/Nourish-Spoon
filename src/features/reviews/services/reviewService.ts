import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';

import { db } from '../../../services/firebase/config';
import { docsToEntities } from '../../../services/firebase/firestore';
import type { Review, ReviewStats } from '../../../types';

export const EMPTY_STATS: ReviewStats = {
  average: 0,
  count: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export async function fetchProductReviews(productId: string, limitValue = 20): Promise<Review[]> {
  const snapshot = await getDocs(
    query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc'),
      limit(limitValue)
    )
  );
  return docsToEntities<Review>(snapshot);
}

export async function fetchRecentReviews(limitValue = 10): Promise<Review[]> {
  const snapshot = await getDocs(
    query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(limitValue))
  );
  return docsToEntities<Review>(snapshot);
}

export async function fetchReviewStats(): Promise<ReviewStats> {
  const snapshot = await getDoc(doc(db, 'meta', 'reviewStats'));
  if (!snapshot.exists()) {
    return EMPTY_STATS;
  }
  const data = snapshot.data() as {
    average?: number;
    count?: number;
    distribution?: Record<string, number> | null;
  };
  const distribution = data.distribution ?? {};
  const bucket = (stars: number) => {
    const value = distribution[String(stars)];
    return typeof value === 'number' ? value : 0;
  };
  return {
    average: typeof data.average === 'number' ? data.average : 0,
    count: typeof data.count === 'number' ? data.count : 0,
    distribution: { 1: bucket(1), 2: bucket(2), 3: bucket(3), 4: bucket(4), 5: bucket(5) },
  };
}

// TEMPORARY client-side review submission until the createReview Cloud Function
// is deployed. The security rules force verifiedPurchase to false on client
// writes; the function is what grants verified-purchase badges later.
export async function submitReviewClientSide(
  uid: string,
  params: { productId: string; rating: number; comment: string }
): Promise<{ verifiedPurchase: boolean }> {
  const [userSnap, productSnap] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getDoc(doc(db, 'products', params.productId)),
  ]);
  if (!productSnap.exists()) {
    throw new Error('Product not found.');
  }
  const product = productSnap.data() as { name: string; rating: number; reviewCount: number };
  const user = userSnap.exists() ? (userSnap.data() as { fullName?: string; city?: string }) : {};

  const newCount = (product.reviewCount ?? 0) + 1;
  const newAverage = ((product.rating ?? 0) * (product.reviewCount ?? 0) + params.rating) / newCount;

  await addDoc(collection(db, 'reviews'), {
    productId: params.productId,
    productName: product.name,
    userId: uid,
    userName: user?.fullName?.trim() || 'Nourish Spoon Customer',
    city: user?.city?.trim() || '',
    rating: params.rating,
    comment: params.comment,
    verifiedPurchase: false,
    createdAt: serverTimestamp(),
  });

  const batch = writeBatch(db);
  batch.update(doc(db, 'products', params.productId), {
    rating: Math.round(newAverage * 10) / 10,
    reviewCount: newCount,
    updatedAt: serverTimestamp(),
  });
  const statsSnap = await getDoc(doc(db, 'meta', 'reviewStats'));
  const stats = statsSnap.exists() ? (statsSnap.data() as { average?: number; count?: number; distribution?: Record<string, number> }) : undefined;
  const statsCount = (stats?.count ?? 0) + 1;
  const distribution = { ...(stats?.distribution ?? {}) };
  distribution[String(params.rating)] = (distribution[String(params.rating)] ?? 0) + 1;
  batch.set(
    doc(db, 'meta', 'reviewStats'),
    {
      average: Math.round((((stats?.average ?? 0) * (stats?.count ?? 0) + params.rating) / statsCount) * 10) / 10,
      count: statsCount,
      distribution,
    },
    { merge: true }
  );
  await batch.commit();
  return { verifiedPurchase: false };
}
