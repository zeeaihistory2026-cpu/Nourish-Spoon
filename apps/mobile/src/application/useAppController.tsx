import { useState, useEffect, useCallback } from "react";
import { BackHandler, Platform, Keyboard, NativeModules } from "react-native";
import { Product, ProductVariant } from "@packages/types";
import { firebaseAuth } from "../services/firebase";
import { useMobileStore } from "../services/storeService";
import { useInfoDialog } from "../components/InfoDialog";
import {
  preloadRewards,
  clearRewardsCache,
} from "../features/commerce/rewardsService";
import { subscribeCatalogue } from "../features/commerce/catalog";
import { useAppBootstrap } from "./useAppBootstrap";
import { usePushNotifications } from "./usePushNotifications";
import { useShoppingSession } from "./useShoppingSession";
import { AppScreen, AppNavigation, AppRoute } from "../navigation/types";
import { isMainTab } from "../navigation/routes";
import { accessibleRoute, entryRoute, signedIn } from "../navigation/access";

export function useAppController() {
  const { showInfo, dialog } = useInfoDialog();
  const theme = useMobileStore((state) => state.theme);
  const [routes, setRoutes] = useState<AppRoute[]>([{ name: "splash" }]);
  const [menuOpen, setMenuOpen] = useState(false);
  const bootstrap = useAppBootstrap();
  const { ready, onboarded, fontsReady } = bootstrap;
  const resetAccountNavigation = useCallback(() => {
    setMenuOpen(false);
    setRoutes([
      { name: signedIn(firebaseAuth?.currentUser) ? "Home" : "Login" },
    ]);
  }, []);
  const { user, authReady } = useShoppingSession(resetAccountNavigation);
  const authenticated = signedIn(user);
  const [catalogueRevision, setCatalogueRevision] = useState(0);
  const retryCatalogue = () => setCatalogueRevision((revision) => revision + 1);
  const route = accessibleRoute(
    routes[routes.length - 1],
    authenticated,
    authReady,
  );
  const screen = route.name;

  // Public catalogue reads start behind the opening logo, before auth restoration.
  // Navigation still requires a real signed-in account.
  useEffect(() => subscribeCatalogue(), [catalogueRevision]);

  useEffect(() => {
    if (!authenticated || !user) {
      clearRewardsCache();
      return;
    }
    void preloadRewards(user.uid).catch(() => {});
    return clearRewardsCache;
  }, [authenticated, user?.uid]);

  const navigate = useCallback(
    (name: AppScreen, params?: AppRoute["params"]) => {
      if (
        name !== "Login" &&
        name !== "Signup" &&
        !signedIn(firebaseAuth?.currentUser)
      ) {
        setMenuOpen(false);
        setRoutes([{ name: "Login" }]);
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
      setRoutes((previous) =>
        isMainTab(name) ? [{ name, params }] : [...previous, { name, params }],
      );
    },
    [showInfo],
  );

  usePushNotifications(authReady ? user?.uid : undefined, navigate);

  const openMenu = () => {
    Keyboard.dismiss();
    if (signedIn(firebaseAuth?.currentUser)) setMenuOpen(true);
  };
  const goBack = useCallback(() => {
    setRoutes((previous) =>
      !signedIn(firebaseAuth?.currentUser)
        ? [{ name: "Login" }]
        : previous.length > 1
          ? previous.slice(0, -1)
          : [{ name: "Home" }],
    );
  }, []);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (menuOpen) {
          setMenuOpen(false);
          return true;
        }
        if (screen === "Home" || screen === "splash" || screen === "Login")
          return false;
        goBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [screen, goBack, menuOpen]);

  const finishSplash = useCallback(() => {
    if (ready && authReady) setRoutes([entryRoute(authenticated, onboarded)]);
  }, [ready, authReady, authenticated, onboarded]);
  const hideNativeLaunch = useCallback(() => {
    if (Platform.OS === "android") NativeModules.NourishLaunchScreen?.hide();
  }, []);
  useEffect(() => {
    if (screen === "splash") return;
    const frame = requestAnimationFrame(hideNativeLaunch);
    return () => cancelAnimationFrame(frame);
  }, [screen, hideNativeLaunch]);
  const completeOnboarding = () => {
    if (!signedIn(firebaseAuth?.currentUser)) {
      setRoutes([{ name: "Login" }]);
      return;
    }
    bootstrap.completeOnboarding();
    setRoutes([{ name: "Home" }]);
  };
  const select = (product: Product) => navigate("ProductDetail", { product });
  const order = (product?: Product, variant?: ProductVariant) =>
    navigate("WhatsAppOrder", {
      initialProduct: product,
      initialVariant: variant,
    });
  const addToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1,
  ) => {
    if (!signedIn(firebaseAuth?.currentUser)) {
      navigate("Login");
      return;
    }
    const store = useMobileStore.getState();
    const before = store.cart;
    store.addToCart(product, variant || product.variants[0], quantity);
    if (before === useMobileStore.getState().cart)
      showInfo(
        "Could not add this item",
        "Check stock and quantities in your cart. You can add up to 10 different sizes, with 20 of each size, subject to availability.",
      );
  };
  const nav: AppNavigation = { navigate, goBack, openMenu };
  const switchAuth = () =>
    setRoutes([{ name: screen === "Login" ? "Signup" : "Login" }]);
  const finishAuth = () =>
    setRoutes([entryRoute(signedIn(firebaseAuth?.currentUser), onboarded)]);

  return {
    theme,
    dialog,
    route,
    screen,
    routes,
    menuOpen: menuOpen && authenticated,
    setMenuOpen,
    nav,
    finishSplash,
    completeOnboarding,
    select,
    order,
    addToCart,
    finishAuth,
    retryCatalogue,
    switchAuth,
    fontsReady,
  };
}
