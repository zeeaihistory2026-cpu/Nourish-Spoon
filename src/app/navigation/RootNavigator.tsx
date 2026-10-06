import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './navigationTypes';
import { useAuth } from '../providers/AuthProvider';
import { useOnboardingStore } from '../../store/onboardingStore';
import { DEMO_MODE } from '../../demo/demo';
import { CartScreen } from '../../features/cart/CartScreen';
import { CheckoutScreen } from '../../features/checkout/CheckoutScreen';
import { OrderSuccessScreen } from '../../features/checkout/OrderSuccessScreen';
import { OrderDetailScreen } from '../../features/orders/OrderDetailScreen';
import { OrdersScreen } from '../../features/orders/OrdersScreen';
import { OnboardingScreen } from '../../features/onboarding/OnboardingScreen';
import { PaymentDeliveryScreen } from '../../features/about/PaymentDeliveryScreen';
import { AddressesScreen } from '../../features/profile/AddressesScreen';
import { ChangePasswordScreen } from '../../features/profile/ChangePasswordScreen';
import { EditProfileScreen } from '../../features/profile/EditProfileScreen';
import { NotificationsScreen } from '../../features/profile/NotificationsScreen';
import { SettingsScreen } from '../../features/profile/SettingsScreen';
import { WishlistScreen } from '../../features/profile/WishlistScreen';
import { FaqScreen } from '../../features/support/FaqScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useAuth();
  const onboardingCompleted = useOnboardingStore((state) => state.completed);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !user && !DEMO_MODE ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen
            name="OrderSuccess"
            component={OrderSuccessScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Addresses" component={AddressesScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="PaymentDelivery" component={PaymentDeliveryScreen} />
          <Stack.Screen name="Faq" component={FaqScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
