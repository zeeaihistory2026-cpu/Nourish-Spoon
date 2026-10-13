import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth } from "./firebase";
import {
  Product,
  ProductVariant,
  Order,
  Review,
  FAQ,
  PaymentMethod,
  DeliveryMethod,
  BrandIdentity,
  FounderStory,
} from "@packages/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_DELIVERY_METHODS,
  BRAND_IDENTITY,
  FOUNDER_STORY,
} from "@packages/catalog/websiteSnapshot";
import { LightTheme, DarkTheme, ThemeType } from "../constants/theme";

export interface MobileStoreState {
  themeMode: "light" | "dark";
  theme: ThemeType;
  currentTheme: ThemeType;
  products: Product[];
  selectedProduct: Product;
  selectedVariant: ProductVariant;
  favorites: string[];
  reviews: Review[];
  faqs: FAQ[];
  paymentMethods: PaymentMethod[];
  deliveryMethods: DeliveryMethod[];
  brandIdentity: BrandIdentity;
  founderStory: FounderStory;
  settings: {
    whatsapp_number: string;
    contact_email: string;
    business_address: string;
    business_hours: string;
    currency: string;
  };
  cart: Array<{ product: Product; variant: ProductVariant; quantity: number }>;

  // Actions
  toggleTheme: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
  selectProduct: (prod: Product) => void;
  selectVariant: (v: ProductVariant) => void;
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
      themeMode: "light",
      theme: LightTheme,
      currentTheme: LightTheme,
      products: INITIAL_PRODUCTS,
      selectedProduct: INITIAL_PRODUCTS[0],
      selectedVariant: INITIAL_PRODUCTS[0].variants[0],
      favorites: [],
      reviews: INITIAL_REVIEWS,
      faqs: INITIAL_FAQS,
      paymentMethods: INITIAL_PAYMENT_METHODS,
      deliveryMethods: INITIAL_DELIVERY_METHODS,
      brandIdentity: BRAND_IDENTITY,
      founderStory: FOUNDER_STORY,
      settings: {
        whatsapp_number: BRAND_IDENTITY.whatsapp_phone,
        contact_email: BRAND_IDENTITY.email,
        business_address: BRAND_IDENTITY.address,
        business_hours: BRAND_IDENTITY.business_hours,
        currency: "PKR",
      },
      cart: [],

      toggleTheme: () =>
        get().setThemeMode(get().themeMode === "light" ? "dark" : "light"),

      setThemeMode: (mode: "light" | "dark") => {
        AsyncStorage.setItem("nourish:theme", mode).catch(() => {});
        const activeTheme = mode === "light" ? LightTheme : DarkTheme;
        set({
          themeMode: mode,
          theme: activeTheme,
          currentTheme: activeTheme,
        });
      },

      selectProduct: (prod: Product) => {
        set({
          selectedProduct: prod,
          selectedVariant: prod.variants[0],
        });
      },

      selectVariant: (v: ProductVariant) => {
        set({ selectedVariant: v });
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
        if (!firebaseAuth?.currentUser || firebaseAuth.currentUser.isAnonymous) return;
        if (
          !product.active ||
          !variant.active ||
          !Number.isInteger(quantity) ||
          quantity < 1
        )
          return;
        const current = get().cart;
        const existing = current.find((item) => item.variant.id === variant.id);
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
          cart: get().cart.map((item) => {
            const product =
              products.find((p) => p.id === item.product.id) ||
              products.find((p) => p.slug && p.slug === item.product.slug);
            const variant = product?.variants.find(
              (v) =>
                v.id === item.variant.id || v.weight === item.variant.weight,
            );
            return product && variant ? { ...item, product, variant } : item;
          }),
        }),
    }),
    {
      name: "nourish:shopping",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites }),
    },
  ),
);

// Export alias for convenience
export const useStore = useMobileStore;
export { BRAND_IDENTITY, FOUNDER_STORY };
