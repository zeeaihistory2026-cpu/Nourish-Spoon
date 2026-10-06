import type { Timestamp } from './product';

export type UserRole = 'customer' | 'staff' | 'admin';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  city?: string;
  role: UserRole;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  isDefault: boolean;
}

export interface DeviceToken {
  token: string;
  platform: string;
  createdAt: Timestamp | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed';
  value: number;
  isActive: boolean;
  minSubtotal?: number;
  expiresAt?: Timestamp | null;
}
