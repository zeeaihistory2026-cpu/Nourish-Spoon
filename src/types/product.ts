import type { Timestamp } from '@react-native-firebase/firestore';

export type { Timestamp };

export type BenefitIcon = 'droplet' | 'sprout' | 'wheat' | 'sparkles' | 'leaf' | 'jar' | 'bowl' | 'shield';

export interface ProductBenefit {
  icon: BenefitIcon;
  label: string;
}

export interface ProductVariant {
  label: string;
  price: number;
  compareAtPrice?: number;
  per100g?: string;
}

export interface Ingredient {
  name: string;
  emoji?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number;
  variants: ProductVariant[];
  weight: string;
  stock: number;
  images: (number | string)[];
  ingredients: Ingredient[];
  benefits: ProductBenefit[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type ProductSort = 'popular' | 'price_asc' | 'price_desc';

export const PRODUCT_SORT_LABELS: Record<ProductSort, string> = {
  popular: 'Popular',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}
