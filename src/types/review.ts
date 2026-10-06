import type { Timestamp } from './product';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  city?: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: Timestamp | null;
  productImage?: number | string;
  helpfulCount?: number;
  screenshot?: { text: string; time: string };
}

export interface ReviewStats {
  average: number;
  count: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}
