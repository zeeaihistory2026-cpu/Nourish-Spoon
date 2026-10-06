import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BRAND } from '../constants';
import type { Category, Ingredient, Product, ProductVariant, Timestamp } from '../types/product';
import type { Order, OrderItem, PaymentMethod } from '../types/order';
import type { Review } from '../types/review';

/**
 * Demo mode: the full app runs against a bundled catalogue with orders and
 * reviews stored on the phone. Flip to false once a real Firebase project is
 * connected (real google-services.json + rebuild) and everything moves to the
 * backend services unchanged.
 */
export const DEMO_MODE = true;

function fakeTimestamp(ms: number): Timestamp {
  return { seconds: Math.floor(ms / 1000), nanoseconds: 0 } as unknown as Timestamp;
}

export const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-cat-balls', name: 'Energy Balls', slug: 'energy-balls', sortOrder: 1 },
  { id: 'demo-cat-panjeeri', name: 'Panjeeri', slug: 'panjeeri', sortOrder: 2 },
];

const COMMON_BENEFITS: Product['benefits'] = [
  { icon: 'leaf', label: 'Freshly\nMade' },
  { icon: 'jar', label: 'Airtight\nPacked' },
  { icon: 'shield', label: 'No\nPreservatives' },
  { icon: 'sprout', label: '100%\nNatural' },
];

export const DEMO_BENEFITS: Product['benefits'] = COMMON_BENEFITS;

const BALLS_INGREDIENTS: Ingredient[] = [
  { name: 'Dates', emoji: 'ðŸ«˜' },
  { name: 'Almonds', emoji: 'ðŸŒ°' },
  { name: 'Walnuts', emoji: 'ðŸŒ°' },
  { name: 'Cashews', emoji: 'ðŸ¥œ' },
  { name: 'Raisins', emoji: 'ðŸ‡' },
  { name: 'Figs', emoji: 'ðŸ«’' },
  { name: 'Coconut', emoji: 'ðŸ¥¥' },
  { name: 'Desi Ghee', emoji: 'ðŸ§ˆ' },
  { name: 'Cardamom', emoji: 'ðŸŒ¿' },
  { name: 'Lotus Seeds', emoji: 'ðŸ¤' },
  { name: 'Pumpkin Seeds', emoji: 'ðŸŽƒ' },
  { name: 'Sunflower Seeds', emoji: 'ðŸŒ»' },
  { name: 'White Sesame Seeds', emoji: 'ðŸŒ¾' },
];

const PANJEERI_INGREDIENTS: Ingredient[] = [
  { name: 'Almonds', emoji: 'ðŸŒ°' },
  { name: 'Walnuts', emoji: 'ðŸŒ°' },
  { name: 'Cashews', emoji: 'ðŸ¥œ' },
  { name: 'Raisins', emoji: 'ðŸ‡' },
  { name: 'Dry Dates', emoji: 'ðŸ«˜' },
  { name: 'Cardamom', emoji: 'ðŸŒ¿' },
  { name: 'Coconut', emoji: 'ðŸ¥¥' },
  { name: 'Semolina (Suji)', emoji: 'ðŸŒ¾' },
  { name: 'Pure Desi Ghee', emoji: 'ðŸ§ˆ' },
  { name: 'Lotus Seeds (Makhana)', emoji: 'ðŸ¤' },
  { name: 'Pumpkin Seeds', emoji: 'ðŸŽƒ' },
  { name: 'Sunflower Seeds', emoji: 'ðŸŒ»' },
];

function demoProduct(
  id: string,
  name: string,
  categoryId: string,
  categoryName: string,
  variants: ProductVariant[],
  image: number | string,
  description: string,
  ingredients: Ingredient[],
  rating: number,
  reviewCount: number
): Product {
  return {
    id,
    name,
    slug: id,
    description,
    categoryId,
    categoryName,
    price: variants[0]?.price ?? 0,
    variants,
    weight: variants[0]?.label ?? '',
    stock: 25,
    images: [image],
    ingredients,
    benefits: COMMON_BENEFITS,
    rating,
    reviewCount,
    isFeatured: true,
    isActive: true,
    createdAt: null,
    updatedAt: null,
  };
}

export const DEMO_PRODUCTS: Product[] = [
  demoProduct(
    'demo-date-nut-balls',
    'Date & Nuts Energy Balls',
    'demo-cat-balls',
    'Energy Balls',
    [
      { label: '250g', price: 1999, compareAtPrice: 2199, per100g: 'Rs. 7.996 per 100g' },
      { label: '500g', price: 3899, per100g: 'Rs. 7.798 per 100g' },
    ],
    BRAND.energyBallsImage,
    'Naturally sweetened, nutrient-dense and packed with wholesome ingredients. No refined sugar.',
    BALLS_INGREDIENTS,
    4.9,
    48
  ),
  demoProduct(
    'demo-homemade-panjeeri',
    'Homemade Panjeeri',
    'demo-cat-panjeeri',
    'Panjeeri',
    [
      { label: '250g', price: 1499, per100g: 'Rs. 5.996 per 100g' },
      { label: '500g', price: 2899, per100g: 'Rs. 5.798 per 100g' },
    ],
    BRAND.panjeeriImage,
    'Traditional family recipe made with pure desi ghee, healthy fats, protein and essential nutrients.',
    PANJEERI_INGREDIENTS,
    4.9,
    62
  ),
];

export const DEMO_ADDRESS = {
  label: 'Home',
  fullName: 'Nourish Spoon Guest',
  phone: '+92 300 0000000',
  line1: 'House 12, Street 4, Sargodha',
  city: 'Sargodha',
};

export const DEMO_REVIEWS: Review[] = [
  {
    id: 'demo-review-1',
    productId: 'demo-homemade-panjeeri',
    productName: 'Homemade Panjeeri',
    productImage: BRAND.panjeeriImage,
    helpfulCount: 18,
    userId: 'demo',
    userName: 'Misbah',
    city: 'Pakistan',
    rating: 5,
    comment: 'Bht acha ha! JazakAllah mamâ€¦',
    verifiedPurchase: true,
    createdAt: fakeTimestamp(Date.now() - 14 * 24 * 60 * 60 * 1000),
    screenshot: { text: 'Bht acha ha! JazakAllah mam â¤ï¸', time: '7:24 PM' },
  },
  {
    id: 'demo-review-2',
    productId: 'demo-date-nut-balls',
    productName: 'Date & Nuts Energy Balls',
    productImage: BRAND.energyBallsImage,
    helpfulCount: 24,
    userId: 'demo',
    userName: 'Rakshanda',
    city: 'Pakistan',
    rating: 5,
    comment:
      'Absolutely love the taste, presentation and most importantly the hygienic homemade quality. Highly recommended!',
    verifiedPurchase: true,
    createdAt: fakeTimestamp(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'demo-review-3',
    productId: 'demo-homemade-panjeeri',
    productName: 'Homemade Panjeeri & Ladoos',
    productImage: BRAND.panjeeriImage,
    helpfulCount: 41,
    userId: 'demo',
    userName: 'ShahJehan',
    city: 'Pakistan',
    rating: 5,
    comment:
      'Panjeeri bohat hi mazedar thi and the complimentary ladoos were such a lovely surprise. Fresh, healthy and truly homemade. Highly recommended!',
    verifiedPurchase: true,
    createdAt: fakeTimestamp(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
];

interface DemoOrder extends Order {
  createdAtMs: number;
}

interface DemoDataState {
  orders: DemoOrder[];
  reviews: Review[];
  orderCounter: number;
  addOrder: (
    items: OrderItem[],
    paymentMethod: PaymentMethod,
    totals: { subtotal: number; deliveryFee: number; total: number }
  ) => DemoOrder;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Review;
}

export const useDemoStore = create<DemoDataState>()(
  persist(
    (set, get) => ({
      orders: [],
      reviews: [],
      orderCounter: 20000,
      addOrder: (items, paymentMethod, totals) => {
        const counter = get().orderCounter + 1;
        const order: DemoOrder = {
          id: `demo-${counter}`,
          orderNumber: `NS-${counter}`,
          userId: 'demo',
          items,
          subtotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          total: totals.total,
          paymentMethod,
          paymentStatus: 'pending',
          orderStatus: 'placed',
          shippingAddress: {
            label: DEMO_ADDRESS.label,
            fullName: DEMO_ADDRESS.fullName,
            phone: DEMO_ADDRESS.phone,
            line1: DEMO_ADDRESS.line1,
            city: DEMO_ADDRESS.city,
          },
          createdAt: null,
          updatedAt: null,
          createdAtMs: Date.now(),
        };
        set((state) => ({ orders: [order, ...state.orders], orderCounter: counter }));
        return order;
      },
      addReview: (review) => {
        const created: Review = {
          ...review,
          id: `demo-review-${Date.now()}`,
          createdAt: fakeTimestamp(Date.now()),
        };
        set((state) => ({ reviews: [created, ...state.reviews] }));
        return created;
      },
    }),
    { name: 'ns.demo.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export function demoOrdersAsOrders(): Order[] {
  return useDemoStore.getState().orders.map(({ createdAtMs, ...rest }) => {
    void createdAtMs;
    return { ...rest, createdAt: fakeTimestamp(createdAtMs) };
  });
}
