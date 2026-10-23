import { View, StatusBar, Platform, KeyboardAvoidingView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CartBar } from "../features/commerce/CartBar";
import { BottomTabBar } from "../components/BottomTabBar";
import { BurgerMenu } from "../components/BurgerMenu";
import { useAppController } from "./useAppController";
import { ScreenContent } from "./ScreenContent";
import { activeTabFor, menuDestinationFor } from "../navigation/routes";

export function MobileApp() {
  const app = useAppController();
  const insets = useSafeAreaInsets();
  const { theme, dialog, screen, route, routes, menuOpen, setMenuOpen, nav } =
    app;
  const activeTab = activeTabFor(routes);
  const hideTabs = ["splash", "onboarding", "Login", "Signup"].includes(screen);
  const orderDetails = screen === "OrderDetails";
  if (!app.fontsReady)
    return <View style={{ flex: 1, backgroundColor: "#FDF6E3" }} />;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        maxWidth: Platform.OS === "web" ? 680 : undefined,
        alignSelf: "center",
        backgroundColor: screen === "splash" ? "#FDF6E3" : theme.background,
        overflow: "hidden",
      }}
      edges={["top", "bottom"]}
    >
      {orderDetails && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: insets.top,
            backgroundColor: "#003E31",
          }}
        />
      )}
      {dialog}
      <StatusBar
        barStyle={
          orderDetails
            ? "light-content"
            : screen === "splash"
              ? "dark-content"
              : theme.isDark
                ? "light-content"
                : "dark-content"
        }
        backgroundColor={
          orderDetails
            ? "#003E31"
            : screen === "splash"
              ? "#FDF6E3"
              : theme.background
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{ flex: 1 }}
          key={`${screen}:${route.params?.product?.id || route.params?.orderId || ""}`}
        >
          <ScreenContent {...app} />
        </View>
        {["Products", "ProductDetail"].includes(screen) && (
          <CartBar onOpen={() => nav.navigate("Cart")} />
        )}
        {!hideTabs && (
          <BottomTabBar activeTab={activeTab} onSelectTab={nav.navigate} />
        )}
      </KeyboardAvoidingView>
      <BurgerMenu
        visible={menuOpen}
        activeDestination={menuDestinationFor(route)}
        onClose={() => setMenuOpen(false)}
        onSelect={(section) => {
          setMenuOpen(false);
          if (section === "payment" || section === "delivery")
            nav.navigate("PaymentDelivery", { section });
          else if (section === "home") nav.navigate("Home");
          else if (section === "story") nav.navigate("About");
          else if (section === "reviews") nav.navigate("Reviews");
          else
            nav.navigate("Products", {
              category: section === "products" ? "all" : section,
            });
        }}
      />
    </SafeAreaView>
  );
}
