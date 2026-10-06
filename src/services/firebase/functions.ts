import type { Address, PaymentMethod, PlacedOrder } from '../../types';
import { cloudFunctions } from './config';

export interface PlaceOrderPayload {
  items: { productId: string; qty: number }[];
  address: Address;
  paymentMethod: PaymentMethod;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<PlacedOrder> {
  const callable = cloudFunctions.httpsCallable<PlaceOrderPayload, PlacedOrder>('createOrder');
  const result = await callable(payload);
  return result.data;
}

export async function submitReview(params: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<{ verifiedPurchase: boolean }> {
  const callable = cloudFunctions.httpsCallable<
    typeof params,
    { verifiedPurchase: boolean }
  >('createReview');
  const result = await callable(params);
  return result.data;
}
