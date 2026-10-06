import { getAnalytics, logEvent, logScreenView, type Analytics } from '@react-native-firebase/analytics';

export const AnalyticsEvent = {
  APP_OPEN: 'app_open',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  PRODUCT_VIEW: 'product_view',
  SEARCH: 'search',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  WISHLIST_ADD: 'wishlist_add',
  WISHLIST_REMOVE: 'wishlist_remove',
  REVIEW_SUBMITTED: 'review_submitted',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

let analyticsInstance: Analytics | null | undefined;

function getAnalyticsOrNull(): Analytics | null {
  if (analyticsInstance === undefined) {
    try {
      analyticsInstance = getAnalytics();
    } catch {
      // Analytics can be unavailable (missing config, unsupported platform).
      analyticsInstance = null;
    }
  }
  return analyticsInstance;
}

export async function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  const analytics = getAnalyticsOrNull();
  if (!analytics) {
    return;
  }
  try {
    // logEvent's overloads pair specific names with specific param shapes; our
    // wrapper passes the caller's flat record through unchanged.
    await logEvent(analytics, name as never, params);
  } catch {
    // Analytics is optional; never let logging break a user flow.
  }
}

export function trackScreen(screenName: string): void {
  const analytics = getAnalyticsOrNull();
  if (!analytics) {
    return;
  }
  try {
    void logScreenView(analytics, { screen_name: screenName, screen_class: screenName });
  } catch {
    // Analytics is optional; never let logging break a user flow.
  }
}

export const trackProductView = (productId: string, name: string) =>
  trackEvent(AnalyticsEvent.PRODUCT_VIEW, { product_id: productId, product_name: name });

export const trackSearch = (query: string) =>
  trackEvent(AnalyticsEvent.SEARCH, { search_term: query });

export const trackAddToCart = (productId: string, qty: number, value: number) =>
  trackEvent(AnalyticsEvent.ADD_TO_CART, { product_id: productId, quantity: qty, value });

export const trackRemoveFromCart = (productId: string) =>
  trackEvent(AnalyticsEvent.REMOVE_FROM_CART, { product_id: productId });

export const trackBeginCheckout = (value: number, items: number) =>
  trackEvent(AnalyticsEvent.BEGIN_CHECKOUT, { value, items });

export const trackPurchase = (orderId: string, value: number) =>
  trackEvent(AnalyticsEvent.PURCHASE, { order_id: orderId, value, currency: 'PKR' });

export const trackWishlistAdd = (productId: string) =>
  trackEvent(AnalyticsEvent.WISHLIST_ADD, { product_id: productId });

export const trackWishlistRemove = (productId: string) =>
  trackEvent(AnalyticsEvent.WISHLIST_REMOVE, { product_id: productId });

export const trackReviewSubmitted = (productId: string, rating: number) =>
  trackEvent(AnalyticsEvent.REVIEW_SUBMITTED, { product_id: productId, rating });
