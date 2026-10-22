import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useMobileStore } from "../services/storeService";

export function useAppBootstrap() {
  const setThemeMode = useMobileStore((state) => state.setThemeMode);
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular: require("@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
    Inter_700Bold: require("@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf"),
    Inter_400Regular_Italic: require("@expo-google-fonts/inter/400Regular_Italic/Inter_400Regular_Italic.ttf"),
    PlayfairDisplay_700Bold: require("@expo-google-fonts/playfair-display/700Bold/PlayfairDisplay_700Bold.ttf"),
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
  const completeOnboarding = () => {
    setOnboarded(true);
    AsyncStorage.setItem("nourish:onboarded", "true").catch(() => {});
  };
  return {
    ready,
    onboarded,
    fontsReady: fontsLoaded || !!fontError,
    completeOnboarding,
  };
}
