import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductVariant, Order, Review, FAQ, PaymentMethod, DeliveryMethod, BrandIdentity, FounderStory } from '@packages/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_FAQS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_DELIVERY_METHODS,
  BRAND_IDENTITY,
  FOUNDER_STORY
} from './mockData';
import { LightTheme, DarkTheme, ThemeType } from '../constants/theme';

export interface MobileStoreState {
  themeMode: 'light' | 'dark';
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
  setThemeMode: (mode: 'light' | 'dark') => void;
  selectProduct: (prod: Product) => void;
  selectVariant: (v: ProductVariant) => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
}

export const useMobileStore = create<MobileStoreState>((set, get) => ({
  themeMode: 'light',
  theme: LightTheme,
  currentTheme: LightTheme,
  products: INITIAL_PRODUCTS,
  selectedProduct: INITIAL_PRODUCTS[0],
  selectedVariant: INITIAL_PRODUCTS[0].variants[0],
  favorites: ['c0000000-0000-0000-0000-000000000001'],
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
    currency: 'PKR',
  },
  cart: [],

  toggleTheme: () => {
    const next = get().themeMode === 'light' ? 'dark' : 'light';
    const activeTheme = next === 'light' ? LightTheme : DarkTheme;
    set({
      themeMode: next,
      theme: activeTheme,
      currentTheme: activeTheme,
    });
  },

  setThemeMode: (mode: 'light' | 'dark') => {
    AsyncStorage.setItem('nourish:theme', mode).catch(() => {});
    const activeTheme = mode === 'light' ? LightTheme : DarkTheme;
    set({
      themeMode: mode,
      theme: activeTheme,
      currentTheme: activeTheme,
    });
  },

  selectProduct: (prod: Product) => {
    set({
      selectedProduct: prod,
      selectedVariant: prod.variants[0]
    });
  },

  selectVariant: (v: ProductVariant) => {
    set({ selectedVariant: v });
  },

  toggleFavorite: (productId: string) => {
    const favs = get().favorites;
    if (favs.includes(productId)) {
      set({ favorites: favs.filter(id => id !== productId) });
    } else {
      set({ favorites: [...favs, productId] });
    }
  },

  addToCart: (product: Product, variant: ProductVariant, quantity = 1) => {
    const current = get().cart;
    const existing = current.find(item => item.variant.id === variant.id);
    if (existing) {
      set({
        cart: current.map(item =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      });
    } else {
      set({ cart: [...current, { product, variant, quantity }] });
    }
  },

  removeFromCart: (variantId: string) => {
    set({ cart: get().cart.filter(item => item.variant.id !== variantId) });
  }
}));

// Export alias for convenience
export const useStore = useMobileStore;
export { BRAND_IDENTITY, FOUNDER_STORY };
