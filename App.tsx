import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProviders } from './src/app/providers/AppProviders';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders />
    </SafeAreaProvider>
  );
}
