import { DefaultTheme, NavigationContainer, type LinkingOptions, type Theme } from '@react-navigation/native';
import { useEffect, useState, type ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from '../navigation/RootNavigator';
import type { RootStackParamList } from '../navigation/navigationTypes';
import { AuthProvider, useAuth } from './AuthProvider';
import { SplashScreen } from '../../features/splash/SplashScreen';
import { ToastHost } from '../../components/ui/ToastHost';
import { useAppFonts, FONT_FAMILY, colors } from '../../theme';

const MIN_SPLASH_MS = 1200;

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.greenMid,
    background: colors.cream,
    card: colors.cream,
    text: colors.text,
    border: colors.border,
    notification: colors.gold,
  },
  fonts: {
    regular: { fontFamily: FONT_FAMILY.body.regular, fontWeight: '400' },
    medium: { fontFamily: FONT_FAMILY.body.medium, fontWeight: '500' },
    bold: { fontFamily: FONT_FAMILY.body.semibold, fontWeight: '600' },
    heavy: { fontFamily: FONT_FAMILY.body.bold, fontWeight: '700' },
  },
};

/**
 * Deep-link routes (scheme `nourishspoon://`, matching app.json).
 * Used for share links, push-notification taps, and WhatsApp order CTAs.
 */
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['nourishspoon://'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Auth: 'auth',
      Main: {
        path: '',
        screens: {
          Home: 'home',
          Products: {
            path: 'products',
            screens: {
              ProductsList: '',
              ProductDetail: 'detail/:productId',
              ProductReviews: 'reviews/:productId',
              WriteReview: 'write-review/:productId',
              WhatsAppOrder: 'whatsapp-order/:productId',
            },
          },
          Reviews: 'all-reviews',
          About: 'about',
          More: 'more',
        },
      },
      Cart: 'cart',
      Checkout: 'checkout',
      OrderSuccess: 'order-success',
      Orders: 'orders',
      OrderDetail: 'orders/:orderId',
      Wishlist: 'wishlist',
      Notifications: 'notifications',
      EditProfile: 'profile/edit',
      Addresses: 'profile/addresses',
      Settings: 'settings',
      ChangePassword: 'settings/change-password',
      PaymentDelivery: 'payment-delivery',
      Faq: 'faq',
    },
  },
};

function SplashGate({ children }: { children: ReactNode }) {
  const { initializing } = useAuth();
  const fontsLoaded = useAppFonts();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || initializing || !minTimeElapsed) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen />
      </>
    );
  }

  return <>{children}</>;
}

export function AppProviders() {
  const fontsLoaded = useAppFonts();
  const statusBarStyle: 'light' | 'dark' = fontsLoaded ? 'dark' : 'light';

  return (
    <AuthProvider>
      <SplashGate>
        <NavigationContainer theme={navigationTheme} linking={linking}>
          <StatusBar style={statusBarStyle} />
          <RootNavigator />
          <ToastHost />
        </NavigationContainer>
      </SplashGate>
    </AuthProvider>
  );
}
