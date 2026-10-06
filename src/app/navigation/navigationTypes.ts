import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string; orderNumber: string; total: number };
  Orders: undefined;
  OrderDetail: { orderId: string };
  Wishlist: undefined;
  Notifications: undefined;
  EditProfile: undefined;
  Addresses: { select?: boolean } | undefined;
  Settings: undefined;
  ChangePassword: undefined;
  PaymentDelivery: undefined;
  Faq: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  // The Products tab hosts its own stack; nested navigation uses the
  // NavigatorScreenParams pattern so `navigate('Products', { screen, params })`
  // typechecks without casts.
  Products: NavigatorScreenParams<ProductsStackParamList> | undefined;
  Reviews: undefined;
  About: undefined;
  More: undefined;
};

// The Products tab owns its own stack so the tab bar stays visible on detail
// screens, exactly as in the reference designs.
export type ProductsStackParamList = {
  ProductsList: { query?: string } | undefined;
  ProductDetail: { productId: string };
  ProductReviews: { productId: string; productName: string };
  WriteReview: { productId: string; productName: string };
  WhatsAppOrder: { productId: string };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
