import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from '@react-native-firebase/firestore';

import { DELIVERY } from '../../../constants';

import { db } from '../../../services/firebase/config';
import { docToEntity, docsToEntities } from '../../../services/firebase/firestore';
import type { AddressSnapshot, Order, OrderItem, PaymentMethod, PlacedOrder } from '../../../types';

const FREE_DELIVERY_THRESHOLD = DELIVERY.freeThreshold;
const DELIVERY_FEE = DELIVERY.fee;

export async function fetchOrders(uid: string, limitValue = 25): Promise<Order[]> {
  const snapshot = await getDocs(
    query(
      collection(db, 'orders'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(limitValue)
    )
  );
  return docsToEntities<Order>(snapshot);
}

export async function fetchOrder(orderId: string): Promise<Order | null> {
  const snapshot = await getDoc(doc(db, 'orders', orderId));
  return docToEntity<Order>(snapshot);
}

export function watchOrder(orderId: string, onChange: (order: Order | null) => void): () => void {
  return onSnapshot(
    doc(db, 'orders', orderId),
    (snapshot) => {
      onChange(snapshot.exists() ? docToEntity<Order>(snapshot) : null);
    },
    () => onChange(null)
  );
}

export async function fetchOrderCount(uid: string): Promise<number> {
  try {
    const snapshot = await getCountFromServer(
      query(collection(db, 'orders'), where('userId', '==', uid))
    );
    return snapshot.data().count;
  } catch {
    return 0;
  }
}

// TEMPORARY client-side ordering used until the createOrder Cloud Function is
// deployed (it needs the Blaze plan). A transaction still re-prices the order
// from the trusted product documents and checks/decrements stock, so totals are
// computed from server data rather than the cart's cached prices.
export async function placeOrderClientSide(
  uid: string,
  items: { productId: string; qty: number }[],
  address: AddressSnapshot,
  paymentMethod: PaymentMethod
): Promise<PlacedOrder> {
  return runTransaction(db, async (tx) => {
    if (items.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const counterRef = doc(db, 'meta', 'orderCounter');
    const counterSnap = await tx.get(counterRef);
    const counter = counterSnap.exists()
      ? ((counterSnap.data() as { count?: number }).count ?? 20000)
      : 20000;
    const orderNumber = `NS-${counter + 1}`;

    const lines: OrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const productSnap = await tx.get(doc(db, 'products', item.productId));
      if (!productSnap.exists()) {
        throw new Error('A product in your cart is no longer available.');
      }
      const product = productSnap.data() as {
        name: string;
        weight: string;
        images?: string[];
        price: number;
        stock: number;
        isActive: boolean;
      };
      if (!product.isActive) {
        throw new Error(`${product.name} is no longer available.`);
      }
      if (product.stock < item.qty) {
        throw new Error(`Only ${Math.max(product.stock, 0)} left of ${product.name}.`);
      }
      subtotal += product.price * item.qty;
      lines.push({
        productId: item.productId,
        name: product.name,
        weight: product.weight,
        image: product.images?.[0] ?? '',
        price: product.price,
        qty: item.qty,
      });
      tx.update(productSnap.ref, {
        stock: increment(-item.qty),
        updatedAt: serverTimestamp(),
      });
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    const orderRef = doc(collection(db, 'orders'));

    tx.set(orderRef, {
      orderNumber,
      userId: uid,
      items: lines,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'placed',
      shippingAddress: {
        label: address.label.trim(),
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        line1: address.line1.trim(),
        city: address.city.trim(),
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    tx.set(counterRef, { count: counter + 1 }, { merge: true });

    return { orderId: orderRef.id, orderNumber, total };
  });
}
