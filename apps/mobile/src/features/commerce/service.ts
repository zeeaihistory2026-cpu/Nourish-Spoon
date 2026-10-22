import { commerceEnabled } from "./availability";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, firebaseAuth } from "../../services/firebase";
import type { Review } from "@packages/types";
import {
  SavedAddress,
  Purchase,
  OrderNotice,
  CartLine,
} from "@packages/types/commerce";

function database() {
  if (!db) throw new Error("Account services are unavailable.");
  return db;
}
function uid() {
  const user = firebaseAuth?.currentUser;
  if (!user || user.isAnonymous)
    throw new Error("Please sign in to use this feature.");
  return user.uid;
}
export async function call<T>(name: string, data: unknown): Promise<T> {
  database();
  if (!commerceEnabled)
    throw new Error(
      name === "quoteOrder"
        ? "Offers and points are not activated yet. No discount has been applied."
        : "Online ordering is not activated yet. Your cart is saved; send it on WhatsApp to place your order.",
    );
  const endpoint = process.env.EXPO_PUBLIC_COMMERCE_API_URL;
  if (
    endpoint &&
    [
      "quoteOrder",
      "placeOrder",
      "getReceipt",
      "getRewards",
      "applyReferral",
      "submitReview",
      "saveProfilePhoto",
      "registerDevice",
      "unregisterDevice",
    ].includes(name)
  ) {
    const userId = uid();
    const token = await firebaseAuth!.currentUser!.getIdToken(
      name === "applyReferral",
    );
    const base = new URL(endpoint);
    if (
      base.protocol !== "https:" &&
      !(
        process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST &&
        ["127.0.0.1", "localhost"].includes(base.hostname)
      )
    )
      throw new Error("The checkout server must use a secure connection.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(`${endpoint.replace(/\/$/, "")}/${name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(body.error || "Checkout is temporarily unavailable.");
      if (firebaseAuth?.currentUser?.uid !== userId)
        throw new Error("Your account changed. Please try again.");
      return body.data as T;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError")
        throw new Error(
          "Checkout took too long. Please try again; your cart is saved.",
        );
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    await httpsCallable(
      getFunctions(firebaseAuth!.app, "us-central1"),
      name,
    )(data)
  ).data as T;
}
export function commerceError(error: any) {
  if (
    error?.code === "permission-denied" ||
    error?.code === "firestore/permission-denied"
  )
    return "This service is not available for your account yet. Please contact Nourish Spoon.";
  if (
    [
      "functions/not-found",
      "functions/unavailable",
      "functions/internal",
    ].includes(error?.code)
  )
    return "Online ordering is temporarily unavailable. Your cart is saved; you can order on WhatsApp.";
  return error?.message || "Could not connect. Please try again.";
}
export function watchOrders(
  next: (items: Purchase[]) => void,
  failed: (error: unknown) => void,
) {
  return onSnapshot(
    query(collection(database(), "orders"), where("customer_uid", "==", uid())),
    (snap) =>
      next(
        snap.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }) as Purchase)
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),
      ),
    failed,
  );
}
export function watchAddresses(
  next: (items: SavedAddress[]) => void,
  failed: (error: unknown) => void,
) {
  return onSnapshot(
    collection(database(), "users", uid(), "addresses"),
    (snap) =>
      next(
        snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as SavedAddress),
      ),
    failed,
  );
}
export async function saveAddress(
  address: Omit<SavedAddress, "id">,
  id?: string,
) {
  const ref = id
    ? doc(database(), "users", uid(), "addresses", id)
    : doc(collection(database(), "users", uid(), "addresses"));
  await setDoc(ref, address);
  return ref.id;
}
export async function removeAddress(id: string) {
  await deleteDoc(doc(database(), "users", uid(), "addresses", id));
}
export function watchNotices(
  next: (items: OrderNotice[]) => void,
  failed: (error: unknown) => void,
) {
  return onSnapshot(
    collection(database(), "users", uid(), "notifications"),
    (snap) =>
      next(
        snap.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }) as OrderNotice)
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),
      ),
    failed,
  );
}
export function watchOwnReviews(
  next: (items: Review[]) => void,
  failed: (error: unknown) => void,
) {
  return onSnapshot(
    query(
      collection(database(), "reviews"),
      where("customer_uid", "==", uid()),
    ),
    (snapshot) =>
      next(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Review),
      ),
    failed,
  );
}
export async function markNotice(id: string) {
  await updateDoc(doc(database(), "users", uid(), "notifications", id), {
    read: true,
  });
}
export type CheckoutInput = {
  promo_code?: string;
  reward_points?: number;
  request_id: string;
  items: CartLine[];
  address: Omit<SavedAddress, "id" | "label">;
  delivery_method: string;
  payment_method: string;
  is_gift: boolean;
  gift_message: string;
};
export const placeOrder = (input: CheckoutInput) =>
  call<Purchase>("placeOrder", input);
