import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, BackHandler } from 'react-native';
import { useMobileStore } from './src/services/storeService';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { WhatsAppOrderScreen } from './src/screens/WhatsAppOrderScreen';
import { PaymentDeliveryScreen } from './src/screens/PaymentDeliveryScreen';
import { CustomerReviewsScreen } from './src/screens/CustomerReviewsScreen';
import { OurStoryScreen } from './src/screens/OurStoryScreen';
import { FAQScreen } from './src/screens/FAQScreen';
import { ContactMoreScreen } from './src/screens/ContactMoreScreen';
import { Product, ProductVariant } from '@packages/types';

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'Home'
  | 'Products'
  | 'Reviews'
  | 'About'
  | 'More'
  | 'ProductDetail'
  | 'WhatsAppOrder'
  | 'PaymentDelivery'
  | 'FAQ';

export default function App() {
  const { theme, selectProduct, selectVariant } = useMobileStore();
  const [screen, setScreen] = useState<ScreenName>('splash');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('Home');
  const [screenParams, setScreenParams] = useState<any>({});

  const navigate = (toScreen: ScreenName | string, params?: any) => {
    setPreviousScreen(screen);
    if (params) {
      setScreenParams(params);
      if (params.product) {
        selectProduct(params.product);
      }
      if (params.variant) {
        selectVariant(params.variant);
      }
    } else {
      setScreenParams({});
    }
    setScreen(toScreen as ScreenName);
  };

  const goBack = () => {
    if (['ProductDetail', 'WhatsAppOrder', 'PaymentDelivery', 'FAQ'].includes(screen)) {
      setScreen(previousScreen || 'Home');
    } else {
      setScreen('Home');
    }
  };

  const navProxy = {
    navigate,
    goBack,
    push: navigate,
    replace: (s: ScreenName) => setScreen(s),
  };

  const handleSelectProduct = (product: Product) => {
    selectProduct(product);
    navigate('ProductDetail', { product });
  };

  const handleOpenWhatsAppOrder = (product?: Product, variant?: ProductVariant) => {
    navigate('WhatsAppOrder', {
      initialProduct: product,
      initialVariant: variant,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
      />

      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('onboarding')} />
      )}

      {screen === 'onboarding' && (
        <OnboardingScreen onComplete={() => setScreen('Home')} />
      )}

      {screen === 'Home' && (
        <HomeScreen
          onNavigateTab={(tab) => navigate(tab)}
          onSelectProduct={handleSelectProduct}
          onOpenWhatsAppOrder={handleOpenWhatsAppOrder}
          onOpenDeliveryInfo={() => navigate('PaymentDelivery')}
        />
      )}

      {screen === 'Products' && (
        <ProductsScreen
          onBack={goBack}
          onSelectProduct={handleSelectProduct}
          onOpenWhatsAppOrder={handleOpenWhatsAppOrder}
        />
      )}

      {screen === 'Reviews' && (
        <CustomerReviewsScreen onBack={goBack} />
      )}

      {screen === 'About' && (
        <OurStoryScreen navigation={navProxy} />
      )}

      {screen === 'More' && (
        <ContactMoreScreen navigation={navProxy} />
      )}

      {screen === 'ProductDetail' && (
        <ProductDetailScreen
          product={screenParams?.product}
          onBack={goBack}
          onOpenWhatsAppOrder={handleOpenWhatsAppOrder}
        />
      )}

      {screen === 'WhatsAppOrder' && (
        <WhatsAppOrderScreen
          initialProduct={screenParams?.initialProduct || screenParams?.product}
          initialVariant={screenParams?.initialVariant || screenParams?.variant}
          onBack={goBack}
          onOrderSuccess={() => navigate('Home')}
        />
      )}

      {screen === 'PaymentDelivery' && (
        <PaymentDeliveryScreen onBack={goBack} />
      )}

      {screen === 'FAQ' && (
        <FAQScreen navigation={navProxy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
