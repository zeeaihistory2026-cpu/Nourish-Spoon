import { Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useNavigation, type CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '../../components/ui/Screen';
import { DrawerMenu } from '../../components/common/DrawerMenu';
import { trackAddToCart } from '../../services/analytics/events';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { BRAND } from '../../constants';
import { colors } from '../../theme';
import { openWhatsApp } from '../../utils/whatsapp';
import type { MainTabParamList, RootStackParamList } from '../../app/navigation/navigationTypes';
import { asProduct } from '../products/lib/productFactory';

// Home is the brand's exact reference artwork. Invisible tap zones sit over
// every interactive element — menu, bell, delivery banner, both hero CTAs,
// View All, and each product card (card, heart, cart) — so it stays
// pixel-identical while remaining fully functional. The products shown are
// the demo catalogue's two signature items, matching the design.
const DATE_NUTS_ID = 'demo-date-nut-balls';
const PANJEERI_ID = 'demo-homemade-panjeeri';

export function HomeScreen() {
  // Composite: tab routes for in-tab navigation, root routes for screens like
  // Notifications that live on the root stack above the tabs.
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<MainTabParamList>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const addItem = useCartStore((store) => store.addItem);
  const productIds = useWishlistStore((store) => store.productIds);
  const toggleWishlist = useWishlistStore((store) => store.toggle);

  const addToCart = (productId: string, name: string, price: number, image: number | string) => {
    const product = asProduct(productId, name, price, image);
    addItem(product, product.variants[0], 1);
    trackAddToCart(productId, 1, price);
  };

  const openProduct = (productId: string) => {
    navigation.navigate('Products', {
      screen: 'ProductDetail',
      params: { productId },
    });
  };

  return (
    <Screen>
      <StatusBar style="dark" />
      <View style={styles.artworkWrap}>
        <Image
          source={BRAND.fullHomeImage}
          style={styles.artwork}
          contentFit="contain" contentPosition="top"
          transition={250}
        />

        {/* Menu (top-left) */}
        <Pressable
          onPress={() => setDrawerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          style={styles.menuZone}
        />
        {/* Bell (top-right) */}
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={styles.bellZone}
        />
        {/* Delivery banner */}
        <Pressable
          onPress={() => navigation.navigate('More')}
          accessibilityRole="button"
          accessibilityLabel="Same-day delivery in Sargodha"
          style={styles.bannerZone}
        />
        {/* Hero: Order on WhatsApp */}
        <Pressable
          onPress={() => openWhatsApp('Hi Nourish Spoon! I would like to place an order.')}
          accessibilityRole="button"
          accessibilityLabel="Order on WhatsApp"
          style={styles.heroWaZone}
        />
        {/* Hero: Explore Products */}
        <Pressable
          onPress={() => navigation.navigate('Products')}
          accessibilityRole="button"
          accessibilityLabel="Explore Products"
          style={styles.exploreZone}
        />
        {/* View All */}
        <Pressable
          onPress={() => navigation.navigate('Products')}
          accessibilityRole="button"
          accessibilityLabel="View all products"
          style={styles.viewAllZone}
        />

        {/* Card 1: Date & Nuts Energy Balls */}
        <Pressable
          onPress={() => openProduct(DATE_NUTS_ID)}
          accessibilityRole="button"
          accessibilityLabel="Date and Nuts Energy Balls"
          style={styles.card1Zone}
        />
        <Pressable
          onPress={() => toggleWishlist(DATE_NUTS_ID)}
          accessibilityRole="button"
          accessibilityLabel="Toggle wishlist"
          style={styles.card1HeartZone}
        />
        <Pressable
          onPress={() => addToCart(DATE_NUTS_ID, 'Date & Nuts Energy Balls', 1999, BRAND.energyBallsImage)}
          accessibilityRole="button"
          accessibilityLabel="Add Date and Nuts Energy Balls to cart"
          style={styles.card1CartZone}
        />

        {/* Card 2: Homemade Panjeeri */}
        <Pressable
          onPress={() => openProduct(PANJEERI_ID)}
          accessibilityRole="button"
          accessibilityLabel="Homemade Panjeeri"
          style={styles.card2Zone}
        />
        <Pressable
          onPress={() => toggleWishlist(PANJEERI_ID)}
          accessibilityRole="button"
          accessibilityLabel="Toggle wishlist"
          style={styles.card2HeartZone}
        />
        <Pressable
          onPress={() => addToCart(PANJEERI_ID, 'Homemade Panjeeri', 1499, BRAND.panjeeriImage)}
          accessibilityRole="button"
          accessibilityLabel="Add Homemade Panjeeri to cart"
          style={styles.card2CartZone}
        />
      </View>

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  artworkWrap: {
    flex: 1,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  menuZone: {
    position: 'absolute',
    top: '5.4%',
    left: '5.4%',
    width: '8%',
    height: '4%',
  },
  bellZone: {
    position: 'absolute',
    top: '5.4%',
    left: '87.5%',
    width: '8.5%',
    height: '4%',
  },
  bannerZone: {
    position: 'absolute',
    top: '14.2%',
    left: '3.7%',
    width: '92.4%',
    height: '5.4%',
  },
  heroWaZone: {
    position: 'absolute',
    top: '46.4%',
    left: '5.6%',
    width: '49%',
    height: '4.6%',
  },
  exploreZone: {
    position: 'absolute',
    top: '51.5%',
    left: '5.6%',
    width: '50%',
    height: '3.8%',
  },
  viewAllZone: {
    position: 'absolute',
    top: '67.2%',
    left: '76.5%',
    width: '19.5%',
    height: '2.8%',
  },
  card1Zone: {
    position: 'absolute',
    top: '70.6%',
    left: '3.7%',
    width: '44.8%',
    height: '22.6%',
  },
  card1HeartZone: {
    position: 'absolute',
    top: '71.3%',
    left: '38.6%',
    width: '7.2%',
    height: '3.6%',
  },
  card1CartZone: {
    position: 'absolute',
    top: '87.4%',
    left: '34%',
    width: '10%',
    height: '4.8%',
  },
  card2Zone: {
    position: 'absolute',
    top: '70.6%',
    left: '50.9%',
    width: '44.8%',
    height: '22.6%',
  },
  card2HeartZone: {
    position: 'absolute',
    top: '71.3%',
    left: '85.7%',
    width: '7.2%',
    height: '3.6%',
  },
  card2CartZone: {
    position: 'absolute',
    top: '87.4%',
    left: '81.1%',
    width: '10%',
    height: '4.8%',
  },
});
