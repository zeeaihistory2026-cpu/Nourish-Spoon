import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => boolean;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const exists = get().productIds.includes(productId);
        set((state) => ({
          productIds: exists
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        }));
        return !exists;
      },
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: 'ns.wishlist.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);
