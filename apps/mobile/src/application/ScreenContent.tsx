import { CatalogueState } from "../features/commerce/CatalogueState";
import { useMobileStore } from "../services/storeService";
import { SplashScreen } from "../screens/SplashScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProductsScreen } from "../screens/ProductsScreen";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { WhatsAppOrderScreen } from "../screens/WhatsAppOrderScreen";
import { PaymentDeliveryScreen } from "../screens/PaymentDeliveryScreen";
import { CustomerReviewsScreen } from "../screens/CustomerReviewsScreen";
import { OurStoryScreen } from "../screens/OurStoryScreen";
import { FAQScreen } from "../screens/FAQScreen";
import { ContactMoreScreen } from "../screens/ContactMoreScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { CartScreen } from "../features/commerce/CartScreen";
import { CheckoutScreen } from "../features/commerce/CheckoutScreen";
import { AddressesScreen } from "../features/commerce/AddressesScreen";
import { TrackOrderScreen } from "../features/commerce/TrackOrderScreen";
import { TcsTrackingScreen } from "../features/commerce/TcsTrackingScreen";
import { OrderTrackingScreen } from "../features/commerce/OrderTrackingScreen";
import { OrderConfirmationScreen } from "../features/commerce/OrderConfirmationScreen";
import { EditProfileScreen } from "../features/commerce/EditProfileScreen";
import { OrdersScreen } from "../features/commerce/OrdersScreen";
import { OrderDetailsScreen } from "../features/commerce/OrderDetailsScreen";
import { NotificationsScreen } from "../features/commerce/NotificationsScreen";
import { RewardsScreen } from "../features/commerce/RewardsScreen";
import { ReferralsScreen } from "../features/commerce/ReferralsScreen";
import type { useAppController } from "./useAppController";
type Props = Pick<
  ReturnType<typeof useAppController>,
  | "route"
  | "screen"
  | "nav"
  | "finishSplash"
  | "completeOnboarding"
  | "select"
  | "order"
  | "addToCart"
  | "finishAuth"
  | "retryCatalogue"
  | "switchAuth"
>;
export function ScreenContent({
  route,
  screen,
  nav,
  finishSplash,
  completeOnboarding,
  select,
  order,
  addToCart,
  finishAuth,
  switchAuth,
  retryCatalogue,
}: Props) {
  const status = useMobileStore((state) => state.catalogueStatus);
  if (
    [
      "Home",
      "Products",
      "Wishlist",
      "ProductDetail",
      "Cart",
      "Checkout",
      "WhatsAppOrder",
    ].includes(screen) &&
    status !== "ready"
  )
    return (
      <CatalogueState
        failed={status === "error"}
        onRetry={retryCatalogue}
        home={screen === "Home"}
        onBack={nav.goBack}
        onMenu={nav.openMenu}
      />
    );
  return (
    <>
      {screen === "splash" && <SplashScreen onFinish={finishSplash} />}
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={completeOnboarding} />
      )}
      {screen === "Home" && (
        <HomeScreen
          onSelectProduct={select}
          onOpenMenu={nav.openMenu}
          onAddToCart={addToCart}
          onOpenNotifications={() => nav.navigate("Notifications")}
          onOpenCategory={(category) => nav.navigate("Products", { category })}
        />
      )}
      {(screen === "Products" || screen === "Wishlist") && (
        <ProductsScreen
          onBrowseProducts={() => nav.navigate("Products")}
          initialCategory={route.params?.category}
          favoritesOnly={screen === "Wishlist"}
          onBack={nav.goBack}
          onSelectProduct={select}
          onOpenWhatsAppOrder={order}
          onAddToCart={addToCart}
        />
      )}
      {screen === "Reviews" && (
        <CustomerReviewsScreen onBack={nav.goBack} navigation={nav} />
      )}
      {screen === "About" && <OurStoryScreen navigation={nav} />}
      {screen === "More" && <ContactMoreScreen navigation={nav} />}
      {screen === "ProductDetail" && route.params?.product && (
        <ProductDetailScreen
          product={route.params.product}
          onBack={nav.goBack}
          onOpenWhatsAppOrder={order}
          onAddToCart={addToCart}
        />
      )}
      {screen === "WhatsAppOrder" && (
        <WhatsAppOrderScreen
          initialProduct={route.params?.initialProduct}
          initialVariant={route.params?.initialVariant}
          onBack={nav.goBack}
          onRequireSignIn={() => nav.navigate("Login")}
        />
      )}
      {screen === "PaymentDelivery" && (
        <PaymentDeliveryScreen
          onBack={nav.goBack}
          initialSection={route.params?.section}
        />
      )}
      {screen === "FAQ" && <FAQScreen navigation={nav} />}
      {screen === "Cart" && <CartScreen navigation={nav} />}
      {screen === "Checkout" && <CheckoutScreen navigation={nav} />}
      {screen === "Addresses" && <AddressesScreen navigation={nav} />}
      {screen === "Orders" && <OrdersScreen navigation={nav} />}
      {screen === "TrackOrder" && <TrackOrderScreen navigation={nav} />}
      {screen === "TcsTracking" && (
        <TcsTrackingScreen
          navigation={nav}
          trackingNumber={route.params?.trackingNumber || ""}
        />
      )}
      {screen === "OrderTracking" && (
        <OrderTrackingScreen
          navigation={nav}
          orderId={route.params?.orderId || ""}
        />
      )}
      {screen === "OrderConfirmation" && (
        <OrderConfirmationScreen
          navigation={nav}
          orderId={route.params?.orderId || ""}
        />
      )}
      {screen === "EditProfile" && (
        <EditProfileScreen
          navigation={nav}
          initialProfile={route.params?.profile}
        />
      )}
      {screen === "OrderDetails" && (
        <OrderDetailsScreen
          navigation={nav}
          orderId={route.params?.orderId || ""}
        />
      )}
      {screen === "Notifications" && <NotificationsScreen navigation={nav} />}
      {screen === "Rewards" && <RewardsScreen navigation={nav} />}
      {screen === "Referrals" && <ReferralsScreen navigation={nav} />}
      {(screen === "Login" || screen === "Signup") && (
        <AuthScreen
          signup={screen === "Signup"}
          onBack={screen === "Signup" ? switchAuth : undefined}
          onSwitch={switchAuth}
          onSuccess={finishAuth}
        />
      )}
    </>
  );
}
