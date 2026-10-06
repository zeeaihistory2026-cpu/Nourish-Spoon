import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
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
  Products: { query?: string } | undefined;
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

export type RootScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type AuthScreenProps<Screen extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  Screen
>;

export type MainTabScreenProps<Screen extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  Screen
>;

export type ProductsStackScreenProps<
  Screen extends keyof ProductsStackParamList
> = NativeStackScreenProps<ProductsStackParamList, Screen>;
