import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "./firebase";
import {
  Product,
  ProductVariant,
  Review,
  FAQ,
  PaymentMethod,
  DeliveryMethod,
} from "@packages/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_DELIVERY_METHODS,
  BRAND_IDENTITY,
} from "@packages/catalog/websiteSnapshot";
import { LightTheme, DarkTheme, ThemeType } from "../constants/theme";
import {
  cartIssue,
  reconcileCart,
  ShoppingLine,
} from "../features/commerce/cart";
import { readVerifiedCatalogue } from "../features/commerce/catalogueCache";

export interface MobileStoreState {
  theme: ThemeType;
  products: Product[];
  catalogueStatus: "loading" | "ready" | "error";
  catalogueVerifiedAt: number | null;
  shoppingAccountId: string | null;
  favorites: string[];
  reviews: Review[];
  faqs: FAQ[];
  paymentMethods: PaymentMethod[];
  deliveryMethods: DeliveryMethod[];
  settings: {
    whatsapp_number: string;
    contact_email: string;
    business_address: string;
    business_hours: string;
    currency: string;
  };
  cart: ShoppingLine[];

  // Actions
  setThemeMode: (mode: "light" | "dark") => void;
  setShoppingAccount: (uid: string | null) => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
  ) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
}

export const useMobileStore = create<MobileStoreState>()(
  persist(
    (set, get) => ({
      theme: LightTheme,
      products: INITIAL_PRODUCTS,
      catalogueStatus: "loading",
      catalogueVerifiedAt: null,
      shoppingAccountId: null,
      favorites: [],
      reviews: INITIAL_REVIEWS,
      faqs: INITIAL_FAQS,
      paymentMethods: INITIAL_PAYMENT_METHODS,
      deliveryMethods: INITIAL_DELIVERY_METHODS,
      settings: {
        whatsapp_number: BRAND_IDENTITY.whatsapp_phone,
        contact_email: BRAND_IDENTITY.email,
        business_address: BRAND_IDENTITY.address,
        business_hours: BRAND_IDENTITY.business_hours,
        currency: "PKR",
      },
      cart: [],

      setThemeMode: (mode: "light" | "dark") => {
        AsyncStorage.setItem("nourish:theme", mode).catch(() => {});
        const activeTheme = mode === "light" ? LightTheme : DarkTheme;
        set({
          theme: activeTheme,
        });
      },

      setShoppingAccount: (uid) => {
        if (get().shoppingAccountId !== uid) {
          set({ shoppingAccountId: uid, cart: [], favorites: [] });
        }
      },

      toggleFavorite: (productId: string) => {
        const favs = get().favorites;
        if (favs.includes(productId)) {
          set({ favorites: favs.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favs, productId] });
        }
      },

      addToCart: (product: Product, variant: ProductVariant, quantity = 1) => {
        if (!firebaseAuth?.currentUser || firebaseAuth.currentUser.isAnonymous)
          return;
        if (
          !product.active ||
          !variant.active ||
          !Number.isInteger(quantity) ||
          quantity < 1
        )
          return;
        const current = get().cart;
        const existing = current.find((item) => item.variant.id === variant.id);
        const nextQuantity = Math.min(20, (existing?.quantity || 0) + quantity);
        const candidate = [
          ...current.filter((item) => item.variant.id !== variant.id),
          { product, variant, quantity: nextQuantity },
        ];
        if (cartIssue(candidate, get().products)) return;
        if (existing) {
          if (existing.quantity >= 20) return;
          set({
            cart: current.map((item) =>
              item.variant.id === variant.id
                ? { ...item, quantity: Math.min(20, item.quantity + quantity) }
                : item,
            ),
          });
        } else {
          if (current.length >= 10) return;
          set({
            cart: [
              ...current,
              { product, variant, quantity: Math.min(20, quantity) },
            ],
          });
        }
      },

      removeFromCart: (variantId: string) => {
        set({
          cart: get().cart.filter((item) => item.variant.id !== variantId),
        });
      },
      updateQuantity: (variantId, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
          return;
        const candidate = get().cart.map((item) =>
          item.variant.id === variantId ? { ...item, quantity } : item,
        );
        // Let customers reduce an invalid quantity even if other items need attention.
        const previous = get().cart.find(
          (item) => item.variant.id === variantId,
        );
        if (
          previous &&
          quantity > previous.quantity &&
          cartIssue(candidate, get().products)
        )
          return;
        set({
          cart: get().cart.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      setProducts: (products) =>
        set({
          products,
          catalogueStatus: "ready",
          catalogueVerifiedAt: Date.now(),
          cart: reconcileCart(get().cart, products),
        }),
    }),
    {
      name: "nourish:shopping",
      version: 1,
      // Older persisted baskets have no trustworthy account owner.
      migrate: () => ({ shoppingAccountId: null, cart: [], favorites: [] }),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        shoppingAccountId: state.shoppingAccountId,
        cart: state.cart,
        favorites: state.favorites,
        products: state.catalogueVerifiedAt ? state.products : [],
        catalogueVerifiedAt: state.catalogueVerifiedAt,
      }),
      merge: (persisted, current) => {
        const saved = (persisted || {}) as Partial<MobileStoreState>;
        const cached = readVerifiedCatalogue(
          saved.products,
          saved.catalogueVerifiedAt,
        );
        // A network response can beat disk hydration; never replace it with older data.
        const restore = !current.catalogueVerifiedAt && cached;
        const products = restore ? restore.products : current.products;
        const verifiedAt = restore
          ? restore.verifiedAt
          : current.catalogueVerifiedAt;
        const cart = Array.isArray(saved.cart) ? saved.cart : [];
        return {
          ...current,
          products,
          catalogueVerifiedAt: verifiedAt,
          catalogueStatus: verifiedAt ? "ready" : current.catalogueStatus,
          shoppingAccountId:
            typeof saved.shoppingAccountId === "string"
              ? saved.shoppingAccountId
              : null,
          favorites: Array.isArray(saved.favorites)
            ? saved.favorites.filter((id) => typeof id === "string")
            : [],
          cart: verifiedAt ? reconcileCart(cart, products) : cart,
        };
      },
    },
  ),
);
