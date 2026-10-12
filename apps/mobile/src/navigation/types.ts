import { Product, ProductVariant } from "@packages/types";
import { MenuSection } from "../components/BurgerMenu";
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
  | "OrderDetails"
  | "Addresses"
  | "Notifications";
export type RouteParams = {
  product?: Product;
  initialProduct?: Product;
  initialVariant?: ProductVariant;
  section?: MenuSection;
  orderId?: string;
};
export type AppNavigation = {
  navigate: (name: AppScreen, params?: RouteParams) => void;
  goBack: () => void;
  openMenu: () => void;
  push: (name: AppScreen, params?: RouteParams) => void;
  replace: (name: AppScreen) => void;
};
