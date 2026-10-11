import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StatusBar,
  BackHandler,
  Platform,
  KeyboardAvoidingView,
  Animated,
  AccessibilityInfo,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, syncPendingCustomerProfile } from "./src/services/firebase";
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
import { BottomTabBar, MobileTab } from "./src/components/BottomTabBar";
import { BurgerMenu, MenuSection } from "./src/components/BurgerMenu";
import { Product, ProductVariant } from "@packages/types";
export type ScreenName =
  | "splash"
  | "onboarding"
  | MobileTab
  | "ProductDetail"
  | "WhatsAppOrder"
  | "PaymentDelivery"
  | "FAQ"
  | "Login"
  | "Signup";
type Route = {
  name: ScreenName;
  params?: {
    product?: Product;
    initialProduct?: Product;
    initialVariant?: ProductVariant;
    section?: MenuSection;
  };
};
const tabs: ScreenName[] = ["Home", "Products", "Reviews", "About", "More"];
function MobileApp() {
  const { theme, selectProduct, setThemeMode } = useMobileStore();
  const [routes, setRoutes] = useState<Route[]>([{ name: "splash" }]);
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => { Keyboard.dismiss(); setMenuOpen(true); };
  const route = routes[routes.length - 1];
  const screen = route.name;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => listener.remove();
  }, []);
  useEffect(() => {
    screenOpacity.stopAnimation();
    if (reduceMotion) { screenOpacity.setValue(1); return; }
    screenOpacity.setValue(0);
    const animation = Animated.timing(screenOpacity, { toValue: 1, duration: 180, useNativeDriver: Platform.OS !== 'web' });
    animation.start();
    return () => animation.stop();
  }, [screen, reduceMotion, screenOpacity]);
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular: require("@expo-google-fonts/cormorant-garamond/400Regular/CormorantGaramond_400Regular.ttf"),
    CormorantGaramond_700Bold: require("@expo-google-fonts/cormorant-garamond/700Bold/CormorantGaramond_700Bold.ttf"),
    CormorantGaramond_400Regular_Italic: require("@expo-google-fonts/cormorant-garamond/400Regular_Italic/CormorantGaramond_400Regular_Italic.ttf"),
    Jost_400Regular: require("@expo-google-fonts/jost/400Regular/Jost_400Regular.ttf"),
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
  useEffect(() => firebaseAuth ? onAuthStateChanged(firebaseAuth, user => {
    if (user) syncPendingCustomerProfile(user.uid).catch(() => {});
  }) : undefined, []);
  const navigate = useCallback(
    (name: string, params?: Route["params"]) => {
      if (params?.product) selectProduct(params.product);
      setRoutes((prev) =>
        tabs.includes(name as ScreenName)
          ? [{ name: name as ScreenName }]
          : [...prev, { name: name as ScreenName, params }],
      );
    },
    [selectProduct],
  );
  const goBack = useCallback(() => {
    setRoutes((prev) =>
      prev.length > 1 ? prev.slice(0, -1) : [{ name: "Home" }],
    );
  }, []);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "Home" || screen === "splash") return false;
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [screen, goBack]);
  const finishSplash = useCallback(() => {
    if (ready) setRoutes([{ name: onboarded ? "Home" : "onboarding" }]);
  }, [ready, onboarded]);
  const completeOnboarding = () => {
    setOnboarded(true);
    AsyncStorage.setItem("nourish:onboarded", "true").catch(() => {});
    setRoutes([{ name: "Home" }]);
  };
  const select = (p: Product) => navigate("ProductDetail", { product: p });
  const order = (p?: Product, v?: ProductVariant) =>
    navigate("WhatsAppOrder", { initialProduct: p, initialVariant: v });
  const nav = {
    navigate,
    goBack,
    push: navigate,
    replace: (name: ScreenName) => setRoutes([{ name }]),
    openMenu,
  };
  const activeTab: MobileTab =
    screen === "ProductDetail" || screen === "WhatsAppOrder"
      ? "Products"
      : screen === "FAQ" || screen === "PaymentDelivery"
        ? "More"
        : (screen as MobileTab);
  const hideTabs = ["splash", "onboarding", "Login", "Signup"].includes(screen);
  if (!fontsLoaded && !fontError)
    return <View style={{ flex: 1, backgroundColor: "#FFF9EC" }} />;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background, overflow: "hidden" }}
      edges={["top", "bottom"]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={{ flex: 1, opacity: screenOpacity }} key={screen}>
          {screen === "splash" && <SplashScreen onFinish={finishSplash} />}
          {screen === "onboarding" && (
            <OnboardingScreen onComplete={completeOnboarding} />
          )}
          {screen === "Home" && (
            <HomeScreen
              onNavigateTab={navigate}
              onSelectProduct={select}
              onOpenWhatsAppOrder={order}
              onOpenDeliveryInfo={() => navigate("PaymentDelivery")}
              onOpenMenu={openMenu}
            />
          )}
          {screen === "Products" && (
            <ProductsScreen
              onBack={goBack}
              onSelectProduct={select}
              onOpenWhatsAppOrder={order}
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
            />
          )}
          {screen === "WhatsAppOrder" && (
            <WhatsAppOrderScreen
              initialProduct={route.params?.initialProduct}
              initialVariant={route.params?.initialVariant}
              onBack={goBack}
            />
          )}
          {screen === "PaymentDelivery" && (
            <PaymentDeliveryScreen onBack={goBack} initialSection={route.params?.section} />
          )}
          {screen === "FAQ" && <FAQScreen navigation={nav} />}
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
              onSuccess={() => navigate("Home")}
            />
          )}
        </Animated.View>
        {!hideTabs && (
          <BottomTabBar activeTab={activeTab} onSelectTab={navigate} />
        )}
      </KeyboardAvoidingView>
      <BurgerMenu visible={menuOpen} reduceMotion={reduceMotion} onClose={() => setMenuOpen(false)} onSelect={section => {
        setMenuOpen(false);
        navigate("PaymentDelivery", { section });
      }} />
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
