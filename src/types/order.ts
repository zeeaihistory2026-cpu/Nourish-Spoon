import type { Timestamp } from './product';

export type OrderStatus = 'placed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  weight: string;
  image: number | string;
  price: number;
  qty: number;
}

export interface AddressSnapshot {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: AddressSnapshot;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface PlacedOrder {
  orderId: string;
  orderNumber: string;
  total: number;
}
