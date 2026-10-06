import { Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { ProductsStackParamList } from '../../app/navigation/navigationTypes';
import { Screen } from '../../components/ui/Screen';
import { toast } from '../../components/ui/toastStore';
import { trackAddToCart } from '../../services/analytics/events';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { BRAND } from '../../constants';
import { colors } from '../../theme';
import { asProduct } from './lib/productFactory';

// Products is the brand's exact reference artwork. Invisible tap zones sit
// over each card's actions — Order on WhatsApp, View Product, cart and
// wishlist — so it stays pixel-identical while remaining fully functional.
// The two cards match the demo catalogue's products and prices exactly.
export function ShopScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const addItem = useCartStore((store) => store.addItem);
  const productIds = useWishlistStore((store) => store.productIds);
  const toggleWishlist = useWishlistStore((store) => store.toggle);

  const dateNuts = asProduct(
    'demo-date-nut-balls',
    'Date & Nuts Energy Balls',
    1999,
    BRAND.energyBallsImage
  );
  const panjeeri = asProduct(
    'demo-homemade-panjeeri',
    'Homemade Panjeeri',
    1499,
    BRAND.panjeeriImage
  );

  const addToCart = (product: typeof dateNuts) => {
    addItem(product, product.variants[0], 1);
    trackAddToCart(product.id, 1, product.price);
    toast('Added to cart');
  };

  return (
    <Screen edges={['left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.artworkWrap}>
        <Image
        pointerEvents="none"
          source={BRAND.fullProductsImage}
          style={styles.artwork}
          contentFit="contain" contentPosition="top"
          transition={250}
        />

        {/* Card 1: Date & Nuts Energy Balls */}
        <Pressable
          onPress={() => navigation.navigate('ProductDetail', { productId: dateNuts.id })}
          accessibilityRole="button"
          accessibilityLabel="View Date and Nuts Energy Balls"
          style={styles.card1Zone}
        />
        <Pressable
          onPress={() => toggleWishlist(dateNuts.id)}
          accessibilityRole="button"
          accessibilityLabel="Toggle wishlist"
          style={styles.heart1Zone}
        />
        <Pressable
          onPress={() => navigation.navigate('WhatsAppOrder', { productId: dateNuts.id })}
          accessibilityRole="button"
          accessibilityLabel="Order on WhatsApp"
          style={styles.wa1Zone}
        />
        <Pressable
          onPress={() => navigation.navigate('ProductDetail', { productId: dateNuts.id })}
          accessibilityRole="button"
          accessibilityLabel="View Product"
          style={styles.view1Zone}
        />
        <Pressable
          onPress={() => addToCart(dateNuts)}
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
          style={styles.cart1Zone}
        />

        {/* Card 2: Homemade Panjeeri */}
        <Pressable
          onPress={() => navigation.navigate('ProductDetail', { productId: panjeeri.id })}
          accessibilityRole="button"
          accessibilityLabel="View Homemade Panjeeri"
          style={styles.card2Zone}
        />
        <Pressable
          onPress={() => toggleWishlist(panjeeri.id)}
          accessibilityRole="button"
          accessibilityLabel="Toggle wishlist"
          style={styles.heart2Zone}
        />
        <Pressable
          onPress={() => navigation.navigate('WhatsAppOrder', { productId: panjeeri.id })}
          accessibilityRole="button"
          accessibilityLabel="Order on WhatsApp"
          style={styles.wa2Zone}
        />
        <Pressable
          onPress={() => navigation.navigate('ProductDetail', { productId: panjeeri.id })}
          accessibilityRole="button"
          accessibilityLabel="View Product"
          style={styles.view2Zone}
        />
        <Pressable
          onPress={() => addToCart(panjeeri)}
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
          style={styles.cart2Zone}
        />
      </View>
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
  card1Zone: {
    position: 'absolute',
    top: '17%',
    left: '4%',
    width: '92%',
    height: '25.5%',
  },
  heart1Zone: {
    position: 'absolute',
    top: '17%',
    left: '86.5%',
    width: '8.5%',
    height: '6%',
  },
  wa1Zone: {
    position: 'absolute',
    top: '43.5%',
    left: '6%',
    width: '54%',
    height: '3.5%',
  },
  view1Zone: {
    position: 'absolute',
    top: '43.5%',
    left: '62.5%',
    width: '22.5%',
    height: '3.5%',
  },
  cart1Zone: {
    position: 'absolute',
    top: '43.5%',
    left: '87.5%',
    width: '7%',
    height: '3.5%',
  },
  card2Zone: {
    position: 'absolute',
    top: '56%',
    left: '4%',
    width: '92%',
    height: '26%',
  },
  heart2Zone: {
    position: 'absolute',
    top: '56%',
    left: '86.5%',
    width: '8.5%',
    height: '6%',
  },
  wa2Zone: {
    position: 'absolute',
    top: '83.5%',
    left: '6%',
    width: '54%',
    height: '3.5%',
  },
  view2Zone: {
    position: 'absolute',
    top: '83.5%',
    left: '62.5%',
    width: '22.5%',
    height: '3.5%',
  },
  cart2Zone: {
    position: 'absolute',
    top: '83.5%',
    left: '87.5%',
    width: '7%',
    height: '3.5%',
  },
});
