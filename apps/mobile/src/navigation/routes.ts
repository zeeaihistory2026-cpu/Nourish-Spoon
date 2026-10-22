import {
  AppRoute,
  AppScreen,
  MAIN_TABS,
  MenuDestination,
  MobileTab,
} from "./types";

export function isMainTab(screen: AppScreen): screen is MobileTab {
  return MAIN_TABS.some((tab) => tab === screen);
}
const detailTabs: Partial<Record<AppScreen, MobileTab>> = {
  ProductDetail: "Products",
  WhatsAppOrder: "Products",
  Wishlist: "More",
  Checkout: "Cart",
  OrderDetails: "Orders",
  OrderConfirmation: "Orders",
  OrderTracking: "Orders",
  Rewards: "More",
  Referrals: "More",
  EditProfile: "More",
  Addresses: "More",
  Notifications: "More",
  TrackOrder: "More",
  TcsTracking: "More",
  FAQ: "More",
};
export function activeTabFor(routes: AppRoute[]): MobileTab {
  const screen = routes[routes.length - 1]?.name;
  if (!screen) return "Home";
  if (isMainTab(screen)) return screen;
  if (detailTabs[screen]) return detailTabs[screen];
  for (let index = routes.length - 1; index >= 0; index--) {
    const name = routes[index].name;
    if (isMainTab(name)) return name;
  }
  return "Home";
}
export function menuDestinationFor(
  route: AppRoute,
): MenuDestination | undefined {
  switch (route.name) {
    case "Home":
      return "home";
    case "About":
      return "story";
    case "Reviews":
      return "reviews";
    case "PaymentDelivery":
      return route.params?.section;
    case "Products": {
      const category = route.params?.category;
      return category === "panjeeri" ||
        category === "energy_balls" ||
        category === "combos"
        ? category
        : "products";
    }
    default:
      return undefined;
  }
}
