import { Product, ProductVariant } from "@packages/types";
export type MenuSection = "payment" | "delivery";
export type MenuDestination =
  | MenuSection
  | "home"
  | "products"
  | "panjeeri"
  | "energy_balls"
  | "combos"
  | "story";
export type MobileTab = "Home" | "Products" | "Cart" | "Orders" | "More";
export const MAIN_TABS: readonly MobileTab[] = [
  "Home",
  "Products",
  "Cart",
  "Orders",
  "More",
];
export type AppScreen =
  | "splash"
  | "onboarding"
  | "Home"
  | "Products"
  | "Reviews"
  | "About"
  | "More"
  | "ProductDetail"
  | "WhatsAppOrder"
  | "PaymentDelivery"
  | "FAQ"
  | "Login"
  | "Signup"
  | "Cart"
  | "Checkout"
  | "Orders"
  | "TrackOrder"
  | "TcsTracking"
  | "OrderDetails"
  | "OrderConfirmation"
  | "OrderTracking"
  | "Wishlist"
  | "EditProfile"
  | "Addresses"
  | "Notifications"
  | "Rewards"
  | "Referrals";
export type RouteParams = {
  product?: Product;
  initialProduct?: Product;
  initialVariant?: ProductVariant;
  section?: MenuSection;
  orderId?: string;
  trackingNumber?: string;
  category?: string;
  profile?: { uid: string; fullName: string; phone?: string };
};
export type AppRoute = { name: AppScreen; params?: RouteParams };
export type AppNavigation = {
  navigate: (name: AppScreen, params?: RouteParams) => void;
  goBack: () => void;
  openMenu: () => void;
};
