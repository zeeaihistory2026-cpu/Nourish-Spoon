import { SafeAreaProvider } from "react-native-safe-area-context";
import { MobileApp } from "./src/application/MobileApp";
import { AppErrorBoundary } from "./src/application/AppErrorBoundary";
export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: "#eeece3" }}>
      <AppErrorBoundary>
        <MobileApp />
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
