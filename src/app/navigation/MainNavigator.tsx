import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import type { MainTabParamList } from './navigationTypes';
import { BottomTabBar } from '../../components/common/BottomTabBar';
import { trackScreen } from '../../services/analytics/events';
import { usePushNotifications } from '../../features/notifications/hooks/usePushNotifications';
import { AboutScreen } from '../../features/about/AboutScreen';
import { HomeScreen } from '../../features/home/HomeScreen';
import { ContactMoreScreen } from '../../features/profile/ContactMoreScreen';
import { ReviewsScreen } from '../../features/reviews/ReviewsScreen';
import { ProductsNavigator } from './ProductsNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  usePushNotifications();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (event) => {
      const route = event.data.state?.routes[event.data.state.index];
      if (route?.name) {
        trackScreen(route.name);
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Products" component={ProductsNavigator} options={{ tabBarLabel: 'Products' }} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} options={{ tabBarLabel: 'Reviews' }} />
      <Tab.Screen name="About" component={AboutScreen} options={{ tabBarLabel: 'About' }} />
      <Tab.Screen name="More" component={ContactMoreScreen} options={{ tabBarLabel: 'More' }} />
    </Tab.Navigator>
  );
}
