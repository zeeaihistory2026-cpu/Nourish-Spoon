import { AppScreen, AppNavigation, RouteParams } from "./src/navigation/types";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StatusBar,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  NativeModules,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import {
  firebaseAuth,
  syncPendingCustomerProfile,
} from "./src/services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useMobileStore } from "./src/services/storeService";
import { SplashScreen } from "./src/screens/SplashScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProductsScreen } from "./src/screens/ProductsScreen";
import { ProductDetailScreen } from "./src/screens/ProductDetailScreen";
import { WhatsAppOrderScreen } from "./src/screens/WhatsAppOrderScreen";
import { PaymentDeliveryScreen } from "./src/screens/PaymentDeliveryScreen";
import { CustomerReviewsScreen } from "./src/screens/CustomerReviewsScreen";
import { OurStoryScreen } from "./src/screens/OurStoryScreen";
import { FAQScreen } from "./src/screens/FAQScreen";
import { ContactMoreScreen } from "./src/screens/ContactMoreScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { CartScreen } from "./src/features/commerce/CartScreen";
import { CartBar } from "./src/features/commerce/CartBar";
import { CheckoutScreen } from "./src/features/commerce/CheckoutScreen";
import { AddressesScreen } from "./src/features/commerce/AddressesScreen";
import { TrackOrderScreen } from "./src/features/commerce/TrackOrderScreen";
import { TcsTrackingScreen } from "./src/features/commerce/TcsTrackingScreen";
import { OrderTrackingScreen } from "./src/features/commerce/OrderTrackingScreen";
import { OrderConfirmationScreen } from "./src/features/commerce/OrderConfirmationScreen";
import { EditProfileScreen } from "./src/features/commerce/EditProfileScreen";
import { OrdersScreen } from "./src/features/commerce/OrdersScreen";
import { OrderDetailsScreen } from "./src/features/commerce/OrderDetailsScreen";
import { NotificationsScreen } from "./src/features/commerce/NotificationsScreen";
import { RewardsScreen } from "./src/features/commerce/RewardsScreen";
import { ReferralsScreen } from "./src/features/commerce/ReferralsScreen";
import { useInfoDialog } from "./src/components/InfoDialog";
import { subscribeCatalogue } from "./src/features/commerce/catalog";
import { BottomTabBar, MobileTab } from "./src/components/BottomTabBar";
import { BurgerMenu, MenuDestination } from "./src/components/BurgerMenu";
import { Product, ProductVariant } from "@packages/types";
import { clearCheckoutDraft } from "./src/features/commerce/checkoutDraft";
export type ScreenName = AppScreen;
type Route = { name: ScreenName; params?: RouteParams };
const tabs: ScreenName[] = ["Home", "Products", "Cart", "Orders", "More"];
function MobileApp() {
  const { showInfo, dialog } = useInfoDialog();
  const { theme, selectProduct, setThemeMode } = useMobileStore();
  const previousUid = useRef(firebaseAuth?.currentUser?.uid || null);
  const pendingRoute = useRef<Route | null>(null);
  const pendingCartAdd = useRef<{
    product: Product;
    variant: ProductVariant;
  } | null>(null);
  const [routes, setRoutes] = useState<Route[]>([{ name: "splash" }]);
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => {
    Keyboard.dismiss();
    setMenuOpen(true);
  };
  const route = routes[routes.length - 1];
  const screen = route.name;
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular: require("@expo-google-fonts/cormorant-garamond/400Regular/CormorantGaramond_400Regular.ttf"),
    CormorantGaramond_700Bold: require("@expo-google-fonts/cormorant-garamond/700Bold/CormorantGaramond_700Bold.ttf"),
    CormorantGaramond_400Regular_Italic: require("@expo-google-fonts/cormorant-garamond/400Regular_Italic/CormorantGaramond_400Regular_Italic.ttf"),
    Jost_400Regular: require("@expo-google-fonts/jost/400Regular/Jost_400Regular.ttf"),
    Jost_500Medium: require("@expo-google-fonts/jost/500Medium/Jost_500Medium.ttf"),
    Jost_600SemiBold: require("@expo-google-fonts/jost/600SemiBold/Jost_600SemiBold.ttf"),
    Jost_700Bold: require("@expo-google-fonts/jost/700Bold/Jost_700Bold.ttf"),
  });
  useEffect(() => {
    AsyncStorage.multiGet(["nourish:onboarded", "nourish:theme"])
      .then((values) => {
        setOnboarded(values[0][1] === "true");
        if (values[1][1] === "dark") setThemeMode("dark");
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(
    () =>
      firebaseAuth
        ? onAuthStateChanged(firebaseAuth, (user) => {
            if (previousUid.current && previousUid.current !== user?.uid) {
              clearCheckoutDraft();
              useMobileStore.getState().clearCart();
            }
            previousUid.current = user?.uid || null;
            if (user) syncPendingCustomerProfile(user.uid).catch(() => {});
          })
        : undefined,
    [],
  );
  useEffect(subscribeCatalogue, []);
  const navigate = useCallback(
    (name: string, params?: Route["params"]) => {
      if (
        [
          "Cart",
          "Checkout",
          "WhatsAppOrder",
          "Rewards",
          "Referrals",
          "Wishlist",
        ].includes(name) &&
        (!firebaseAuth?.currentUser || firebaseAuth.currentUser.isAnonymous)
      ) {
        pendingRoute.current = { name: name as ScreenName, params };
        setRoutes((previous) => [...previous, { name: "Login" }]);
        return;
      }
      if (name === "WhatsAppOrder") {
        const product =
          params?.initialProduct ||
          useMobileStore
            .getState()
            .products.find(
              (item) =>
                item.active && item.variants.some((size) => size.active),
            );
        if (!product) {
          showInfo(
            "Products unavailable",
            "Please contact Nourish Spoon using More for current availability.",
          );
          return;
        }
        params = { ...params, initialProduct: product };
      }
      if (params?.product) selectProduct(params.product);
      setRoutes((prev) =>
        tabs.includes(name as ScreenName)
          ? [{ name: name as ScreenName, params }]
          : [...prev, { name: name as ScreenName, params }],
      );
    },
    [selectProduct],
  );
  const goBack = useCallback(() => {
    pendingRoute.current = null;
    pendingCartAdd.current = null;
    setRoutes((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : [{ name: "Home" }],
    );
  }, []);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (menuOpen) {
        setMenuOpen(false);
        return true;
      }
      if (screen === "Home" || screen === "splash") return false;
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [screen, goBack, menuOpen]);
  const finishSplash = useCallback(() => {
    if (ready) setRoutes([{ name: onboarded ? "Home" : "onboarding" }]);
  }, [ready, onboarded]);
  const hideNativeLaunch = useCallback(() => {
    if (Platform.OS === "android") NativeModules.NourishLaunchScreen?.hide();
  }, []);
  useEffect(() => {
    if (screen === "splash" || (screen === "onboarding" && !ready)) return;
    // Hide only after the first destination has committed its native view.
    const frame = requestAnimationFrame(hideNativeLaunch);
    return () => cancelAnimationFrame(frame);
  }, [screen, ready, hideNativeLaunch]);
  const completeOnboarding = () => {
    setOnboarded(true);
    AsyncStorage.setItem("nourish:onboarded", "true").catch(() => {});
    setRoutes([{ name: "Home" }]);
  };
  const select = (p: Product) => navigate("ProductDetail", { product: p });
  const order = (p?: Product, v?: ProductVariant) => {
    const product =
      p ||
      useMobileStore
        .getState()
        .products.find(
          (item) => item.active && item.variants.some((size) => size.active),
        );
    if (!product) {
      showInfo(
        "Products unavailable",
        "Please contact Nourish Spoon using More for current availability.",
      );
      return;
    }
    navigate("WhatsAppOrder", { initialProduct: product, initialVariant: v });
  };
  const addToCart = (product: Product, variant?: ProductVariant) => {
    if (!firebaseAuth?.currentUser || firebaseAuth.currentUser.isAnonymous) {
      pendingCartAdd.current = {
        product,
        variant: variant || product.variants[0],
      };
      navigate("Login");
      return;
    }
    const before = useMobileStore.getState().cart;
    useMobileStore
      .getState()
      .addToCart(product, variant || product.variants[0]);
    if (before === useMobileStore.getState().cart)
      showInfo(
        "Cart limit",
        "Your cart can hold up to 10 different sizes, with 20 of each size. Unavailable sizes cannot be added. Tap View Cart to review your items.",
      );
  };
  const nav: AppNavigation = {
    navigate,
    goBack,
    push: navigate,
    replace: (name: ScreenName) => setRoutes([{ name }]),
    openMenu,
  };
  const activeTab: MobileTab = [
    "OrderDetails",
    "OrderConfirmation",
    "OrderTracking",
    "Orders",
  ].includes(screen)
    ? "Orders"
    : ["Cart", "Checkout"].includes(screen)
      ? "Cart"
      : [
            "Wishlist",
            "Rewards",
            "Referrals",
            "EditProfile",
            "Addresses",
            "Notifications",
            "TrackOrder",
            "TcsTracking",
            "FAQ",
            "More",
          ].includes(screen)
        ? "More"
        : ["ProductDetail", "WhatsAppOrder", "Products"].includes(screen)
          ? "Products"
          : ([...routes].reverse().find((route) => tabs.includes(route.name))
              ?.name as MobileTab) || "Home";
  const hideTabs = ["splash", "onboarding", "Login", "Signup"].includes(screen);
  if (!fontsLoaded && !fontError)
    return <View style={{ flex: 1, backgroundColor: "#FDF6E3" }} />;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: screen === "splash" ? "#FDF6E3" : theme.background,
        overflow: "hidden",
      }}
      edges={["top", "bottom"]}
    >
      {dialog}
      <StatusBar
        barStyle={
          screen === "splash"
            ? "dark-content"
            : theme.isDark
              ? "light-content"
              : "dark-content"
        }
        backgroundColor={screen === "splash" ? "#FDF6E3" : theme.background}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1 }} key={screen}>
          {screen === "splash" && <SplashScreen onFinish={finishSplash} />}
          {screen === "onboarding" && (
            <OnboardingScreen onComplete={completeOnboarding} />
          )}
          {screen === "Home" && (
            <HomeScreen
              onSelectProduct={select}
              onOpenMenu={openMenu}
              onAddToCart={addToCart}
              onOpenCart={() => navigate("Cart")}
              onOpenCategory={(category) => navigate("Products", { category })}
            />
          )}
          {(screen === "Products" || screen === "Wishlist") && (
            <ProductsScreen
              initialCategory={route.params?.category}
              favoritesOnly={screen === "Wishlist"}
              onBack={goBack}
              onSelectProduct={select}
              onOpenWhatsAppOrder={order}
              onAddToCart={addToCart}
            />
          )}
          {screen === "Reviews" && (
            <CustomerReviewsScreen onBack={goBack} navigation={nav} />
          )}
          {screen === "About" && <OurStoryScreen navigation={nav} />}
          {screen === "More" && <ContactMoreScreen navigation={nav} />}
          {screen === "ProductDetail" && (
            <ProductDetailScreen
              product={route.params?.product}
              onBack={goBack}
              onOpenWhatsAppOrder={order}
              onAddToCart={addToCart}
            />
          )}
          {screen === "WhatsAppOrder" && (
            <WhatsAppOrderScreen
              initialProduct={route.params?.initialProduct}
              initialVariant={route.params?.initialVariant}
              onBack={goBack}
              onRequireSignIn={() => navigate("Login")}
            />
          )}
          {screen === "PaymentDelivery" && (
            <PaymentDeliveryScreen
              onBack={goBack}
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
          {screen === "Notifications" && (
            <NotificationsScreen navigation={nav} />
          )}
          {screen === "Rewards" && <RewardsScreen navigation={nav} />}
          {screen === "Referrals" && <ReferralsScreen navigation={nav} />}
          {(screen === "Login" || screen === "Signup") && (
            <AuthScreen
              signup={screen === "Signup"}
              onBack={goBack}
              onSwitch={() =>
                setRoutes((prev) => [
                  ...prev.slice(0, -1),
                  { name: screen === "Login" ? "Signup" : "Login" },
                ])
              }
              onSuccess={() => {
                const add = pendingCartAdd.current,
                  destination = pendingRoute.current;
                pendingCartAdd.current = null;
                pendingRoute.current = null;
                setRoutes((previous) =>
                  previous.filter(
                    (route) => !["Login", "Signup"].includes(route.name),
                  ),
                );
                if (add)
                  useMobileStore.getState().addToCart(add.product, add.variant);
                if (destination) navigate(destination.name, destination.params);
                else if (!add && routes.length < 2) navigate("Home");
              }}
            />
          )}
        </View>
        {["Home", "Products", "ProductDetail"].includes(screen) && (
          <CartBar onOpen={() => navigate("Cart")} />
        )}
        {!hideTabs && (
          <BottomTabBar activeTab={activeTab} onSelectTab={navigate} />
        )}
      </KeyboardAvoidingView>
      <BurgerMenu
        visible={menuOpen}
        activeDestination={
          screen === "Home"
            ? "home"
            : screen === "Products"
              ? route.params?.category && route.params.category !== "all"
                ? (route.params.category as MenuDestination)
                : "products"
              : screen === "About"
                ? "story"
                : screen === "Reviews"
                  ? "reviews"
                  : screen === "PaymentDelivery"
                    ? route.params?.section
                    : undefined
        }
        onClose={() => setMenuOpen(false)}
        onSelect={(section) => {
          setMenuOpen(false);
          if (section === "payment" || section === "delivery")
            navigate("PaymentDelivery", { section });
          else if (section === "home") navigate("Home");
          else if (section === "story") navigate("About");
          else if (section === "reviews") navigate("Reviews");
          else
            navigate("Products", {
              category: section === "products" ? "all" : section,
            });
        }}
      />
    </SafeAreaView>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <MobileApp />
    </SafeAreaProvider>
  );
}
