import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

initializeApp();
const db = getFirestore();

// Keep in sync with DELIVERY in the app's src/constants — the client shows these
// same numbers before checkout, but this value is what the order is actually billed with.
const DELIVERY_FEE = 150;
const FREE_DELIVERY_THRESHOLD = 2500;
const MAX_QTY_PER_ITEM = 99;

type PaymentMethod = 'cod' | 'bank_transfer';
type OrderStatus = 'placed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

interface PlaceOrderData {
  items: { productId: string; qty: number }[];
  address: {
    label: string;
    fullName: string;
    phone: string;
    line1: string;
    city: string;
  };
  paymentMethod: PaymentMethod;
}

interface CreateReviewData {
  productId: string;
  rating: number;
  comment: string;
}

function assertSignedInUid(auth: { uid?: string } | undefined): string {
  if (!auth?.uid) {
    throw new HttpsError('unauthenticated', 'Please sign in to continue.');
  }
  return auth.uid;
}

async function readCustomClaims(uid: string): Promise<Record<string, unknown>> {
  const user = await (await import('firebase-admin/auth')).getAuth().getUser(uid);
  return user.customClaims ?? {};
}

async function isStaff(uid: string): Promise<boolean> {
  const claims = await readCustomClaims(uid);
  return claims.admin === true || claims.staff === true;
}

async function pushToUser(uid: string, title: string, body: string): Promise<void> {
  try {
    const devices = await db.collection(`users/${uid}/devices`).get();
    const tokens = devices.docs.map((doc) => doc.id).filter((token) => token.length > 0);
    if (tokens.length === 0) {
      return;
    }
    await getMessaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
    });
  } catch (error) {
    console.error('push failed', uid, error);
  }
}

async function notifyUser(uid: string, title: string, body: string, orderId?: string): Promise<void> {
  await db.collection('notifications').add({
    recipientUid: uid,
    title,
    body,
    ...(orderId ? { orderId } : {}),
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });
  await pushToUser(uid, title, body);
}

export const createOrder = onCall(async (request) => {
  const uid = assertSignedInUid(request.auth);
  const data = request.data as PlaceOrderData;

  if (!data || typeof data !== 'object') {
    throw new HttpsError('invalid-argument', 'Your cart could not be read. Please try again.');
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new HttpsError('invalid-argument', 'Your cart is empty.');
  }
  if (data.items.length > 50) {
    throw new HttpsError('invalid-argument', 'That is too many items for one order. Please contact us.');
  }
  for (const item of data.items) {
    if (
      !item ||
      typeof item.productId !== 'string' ||
      !Number.isInteger(item.qty) ||
      item.qty < 1 ||
      item.qty > MAX_QTY_PER_ITEM
    ) {
      throw new HttpsError('invalid-argument', 'Please check the quantities in your cart.');
    }
  }
  const address = data.address;
  if (
    !address ||
    typeof address !== 'object' ||
    [address.label, address.fullName, address.phone, address.line1, address.city].some(
      (field) => typeof field !== 'string' || field.trim().length === 0
    )
  ) {
    throw new HttpsError('invalid-argument', 'Please choose a complete delivery address.');
  }
  if (data.paymentMethod !== 'cod' && data.paymentMethod !== 'bank_transfer') {
    throw new HttpsError('invalid-argument', 'Please choose a payment method.');
  }

  try {
    const result = await db.runTransaction(async (tx) => {
      const counterRef = db.doc('meta/orderCounter');
      const counterSnap = await tx.get(counterRef);
      const counter = counterSnap.exists ? (counterSnap.data()?.count ?? 20000) : 20000;
      const orderNumber = `NS-${counter + 1}`;

      // Read every referenced product inside the transaction so prices and stock
      // are the committed, trusted values — never the client's copies.
      const productRefs = data.items.map((item) => db.doc(`products/${item.productId}`));
      const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

      const lines: {
        productId: string;
        name: string;
        weight: string;
        image: string;
        price: number;
        qty: number;
      }[] = [];
      let subtotal = 0;

      productSnaps.forEach((snap, index) => {
        const item = data.items[index];
        if (!snap.exists) {
          throw new HttpsError('failed-precondition', 'A product in your cart is no longer available.');
        }
        const product = snap.data() as {
          name: string;
          weight: string;
          images?: string[];
          price: number;
          stock: number;
          isActive: boolean;
        };
        if (!product.isActive) {
          throw new HttpsError('failed-precondition', `${product.name} is no longer available.`);
        }
        if (!Number.isFinite(product.price) || product.price < 0) {
          throw new HttpsError('failed-precondition', `${product.name} cannot be ordered right now.`);
        }
        if (product.stock < item.qty) {
          throw new HttpsError(
            'failed-precondition',
            `Only ${Math.max(product.stock, 0)} left of ${product.name}.`
          );
        }

        subtotal += product.price * item.qty;
        lines.push({
          productId: snap.id,
          name: product.name,
          weight: product.weight,
          image: product.images?.[0] ?? '',
          price: product.price,
          qty: item.qty,
        });

        tx.update(snap.ref, { stock: FieldValue.increment(-item.qty), updatedAt: FieldValue.serverTimestamp() });
      });

      const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
      const total = subtotal + deliveryFee;

      const orderRef = db.collection('orders').doc();
      tx.set(orderRef, {
        orderNumber,
        userId: uid,
        items: lines,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'placed',
        shippingAddress: {
          label: address.label.trim(),
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          line1: address.line1.trim(),
          city: address.city.trim(),
        },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.set(counterRef, { count: counter + 1 }, { merge: true });

      return { orderId: orderRef.id, orderNumber, total };
    });

    await notifyUser(
      uid,
      'Order placed',
      `Your order ${result.orderNumber} has been received and will be packed with love.`,
      result.orderId
    );
    return result;
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error('createOrder failed', uid, error);
    throw new HttpsError('internal', 'We could not place your order. Please try again.');
  }
});

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  placed: ['packed', 'cancelled'],
  packed: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order placed',
  packed: 'Order packed',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Order cancelled',
};

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  placed: 'Your order has been received.',
  packed: 'Your order has been packed fresh and is ready to go.',
  out_for_delivery: 'Your order is on its way.',
  delivered: 'Enjoy your handcrafted goodness — crafted with love.',
  cancelled: 'Your order has been cancelled.',
};

export const setOrderStatus = onCall(async (request) => {
  const uid = assertSignedInUid(request.auth);
  if (!(await isStaff(uid))) {
    throw new HttpsError('permission-denied', 'You do not have permission to do that.');
  }

  const data = request.data as { orderId?: string; orderStatus?: OrderStatus; paymentStatus?: string };
  if (!data?.orderId || !data.orderStatus) {
    throw new HttpsError('invalid-argument', 'Missing order or status.');
  }
  const next = data.orderStatus;
  if (!(next in STATUS_FLOW)) {
    throw new HttpsError('invalid-argument', 'Unknown order status.');
  }
  if (data.paymentStatus && !['pending', 'paid', 'failed', 'refunded'].includes(data.paymentStatus)) {
    throw new HttpsError('invalid-argument', 'Unknown payment status.');
  }

  const orderRef = db.doc(`orders/${data.orderId}`);
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Order not found.');
    }
    const order = snap.data() as { orderStatus: OrderStatus; userId: string };
    if (!STATUS_FLOW[order.orderStatus]?.includes(next)) {
      throw new HttpsError(
        'failed-precondition',
        `An order that is ${order.orderStatus.replace(/_/g, ' ')} cannot move to ${next.replace(/_/g, ' ')}.`
      );
    }
    const update: Record<string, unknown> = {
      orderStatus: next,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (data.paymentStatus) {
      update.paymentStatus = data.paymentStatus;
    }
    tx.update(orderRef, update);
    return { userId: order.userId, orderNumber: (snap.data() as { orderNumber: string }).orderNumber };
  });

  await notifyUser(
    result.userId,
    STATUS_LABELS[next],
    `${STATUS_MESSAGES[next]} (${result.orderNumber})`,
    data.orderId
  );
  return { ok: true };
});

export const setUserRole = onCall(async (request) => {
  const uid = assertSignedInUid(request.auth);
  const claims = await readCustomClaims(uid);
  if (claims.admin !== true) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }

  const data = request.data as { uid?: string; role?: 'customer' | 'staff' | 'admin' };
  if (!data?.uid || !data.role || !['customer', 'staff', 'admin'].includes(data.role)) {
    throw new HttpsError('invalid-argument', 'Provide a uid and a valid role.');
  }
  const auth = (await import('firebase-admin/auth')).getAuth();
  await auth.setCustomUserClaims(data.uid, { [data.role]: true });
  await db.doc(`users/${data.uid}`).update({
    role: data.role,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { ok: true };
});

export const createReview = onCall(async (request) => {
  const uid = assertSignedInUid(request.auth);
  const data = request.data as CreateReviewData;

  if (!data?.productId || typeof data.productId !== 'string') {
    throw new HttpsError('invalid-argument', 'Missing product.');
  }
  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    throw new HttpsError('invalid-argument', 'Please choose a star rating.');
  }
  const comment = (data.comment ?? '').toString().trim();
  if (comment.length < 4 || comment.length > 500) {
    throw new HttpsError('invalid-argument', 'Please write a review between 4 and 500 characters.');
  }

  const [userSnap, existingSnap, ordersSnap, productSnap] = await Promise.all([
    db.doc(`users/${uid}`).get(),
    db.collection('reviews').where('userId', '==', uid).where('productId', '==', data.productId).get(),
    db.collection('orders')
      .where('userId', '==', uid)
      .where('orderStatus', '==', 'delivered')
      .get(),
    db.doc(`products/${data.productId}`).get(),
  ]);

  if (!existingSnap.empty) {
    throw new HttpsError('already-exists', 'You have already reviewed this product.');
  }
  if (!productSnap.exists) {
    throw new HttpsError('not-found', 'Product not found.');
  }

  const deliveredIds = new Set(ordersSnap.docs.map((doc) => doc.id));
  const verifiedPurchase = ordersSnap.docs.some((doc) => {
    const order = doc.data() as { items: { productId: string }[] };
    return order.items.some((item) => item.productId === data.productId) && deliveredIds.has(doc.id);
  });

  const user = userSnap.data() as { fullName?: string; city?: string } | undefined;
  const product = productSnap.data() as { name: string; rating: number; reviewCount: number };

  const reviewRef = db.collection('reviews').doc();
  const newCount = (product.reviewCount ?? 0) + 1;
  const newAverage = ((product.rating ?? 0) * (product.reviewCount ?? 0) + data.rating) / newCount;

  const statsRef = db.doc('meta/reviewStats');
  const statsSnap = await statsRef.get();
  const stats = statsSnap.data() as
    | { average: number; count: number; distribution: Record<string, number> }
    | undefined;
  const statsCount = (stats?.count ?? 0) + 1;
  const bucket = String(data.rating);
  const distribution = { ...(stats?.distribution ?? {}) };
  distribution[bucket] = (distribution[bucket] ?? 0) + 1;

  const batch = db.batch();
  batch.set(reviewRef, {
    productId: data.productId,
    productName: product.name,
    userId: uid,
    userName: user?.fullName?.trim() || 'Nourish Spoon Customer',
    city: user?.city?.trim() || '',
    rating: data.rating,
    comment,
    verifiedPurchase,
    createdAt: FieldValue.serverTimestamp(),
  });
  batch.update(productSnap.ref, {
    rating: Math.round(newAverage * 10) / 10,
    reviewCount: newCount,
    updatedAt: FieldValue.serverTimestamp(),
  });
  batch.set(
    statsRef,
    {
      average: Math.round(((stats?.average ?? 0) * (stats?.count ?? 0) + data.rating) / statsCount * 10) / 10,
      count: statsCount,
      distribution,
    },
    { merge: true }
  );
  await batch.commit();

  return { verifiedPurchase };
});

// Profiles are created by the client on sign-up; this trigger backfills any that
// were missed (e.g. users created through the console) and never overwrites data.
export const ensureUserProfile = onDocumentCreated('users/{uid}', (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    return null;
  }
  const data = snapshot.data();
  if (data?.role && data?.createdAt) {
    return null;
  }
  return snapshot.ref.set(
    {
      uid: event.params.uid,
      fullName: data?.fullName ?? '',
      email: data?.email ?? '',
      city: data?.city ?? '',
      role: data?.role ?? 'customer',
      createdAt: data?.createdAt ?? Timestamp.now(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
});
