import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DELIVERY } from '../constants';
import type { Product, ProductVariant } from '../types/product';

export interface CartItem {
  productId: string;
  name: string;
  variantLabel: string;
  image: number | string;
  price: number;
  qty: number;
}

const MAX_QTY = 99;

export function cartItemKey(productId: string, variantLabel: string): string {
  return `${productId}|${variantLabel}`;
}

export function deliveryFeeFor(subtotal: number): number {
  if (subtotal <= 0) {
    return 0;
  }
  return subtotal >= DELIVERY.freeThreshold ? 0 : DELIVERY.fee;
}

export function cartTotals(items: CartItem[]): {
  subtotal: number;
  deliveryFee: number;
  total: number;
  count: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = deliveryFeeFor(subtotal);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return { subtotal, deliveryFee, total: subtotal + deliveryFee, count };
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, qty: number) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, variant, qty) =>
        set((state) => {
          const key = cartItemKey(product.id, variant.label);
          const existing = state.items.find(
            (item) => cartItemKey(item.productId, item.variantLabel) === key
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                cartItemKey(item.productId, item.variantLabel) === key
                  ? { ...item, qty: Math.min(MAX_QTY, item.qty + qty) }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                variantLabel: variant.label,
                image: product.images[0] ?? '',
                price: variant.price,
                qty: Math.min(MAX_QTY, Math.max(1, qty)),
              },
            ],
          };
        }),
      increment: (key) =>
        set((state) => ({
          items: state.items.map((item) =>
            cartItemKey(item.productId, item.variantLabel) === key
              ? { ...item, qty: Math.min(MAX_QTY, item.qty + 1) }
              : item
          ),
        })),
      decrement: (key) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              cartItemKey(item.productId, item.variantLabel) === key
                ? { ...item, qty: item.qty - 1 }
                : item
            )
            .filter((item) => item.qty > 0),
        })),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter(
            (item) => cartItemKey(item.productId, item.variantLabel) !== key
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'ns.cart.v2', storage: createJSONStorage(() => AsyncStorage) }
  )
);
