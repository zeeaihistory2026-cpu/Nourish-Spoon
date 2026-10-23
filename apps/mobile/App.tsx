import { SafeAreaProvider } from "react-native-safe-area-context";
import { MobileApp } from "./src/application/MobileApp";
import { AppErrorBoundary } from "./src/application/AppErrorBoundary";
import { NotificationInboxProvider } from "./src/features/commerce/NotificationInbox";
export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: "#eeece3" }}>
      <AppErrorBoundary>
        <NotificationInboxProvider>
          <MobileApp />
        </NotificationInboxProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}
