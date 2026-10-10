import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProviders } from './src/app/providers/AppProviders';
import { ErrorBoundary } from './src/app/ErrorBoundary';

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProviders />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
