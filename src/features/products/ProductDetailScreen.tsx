import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { ProductsStackParamList } from '../../app/navigation/navigationTypes';
import { useWishlistStore } from '../../store/wishlistStore';
import { BRAND } from '../../constants';
import { colors } from '../../theme';

// Product Detail is the brand's exact reference artwork — one variant per
// known demo product. Invisible tap zones cover the back button, the
// wishlist heart and the bottom Order-on-WhatsApp pill. Unknown products
// fall back to the Energy Balls artwork.
const ARTWORK_BY_PRODUCT: Record<string, number> = {
  'demo-date-nut-balls': BRAND.fullDetailBallsImage,
  'demo-homemade-panjeeri': BRAND.fullDetailPanjeeriImage,
};

export function ProductDetailScreen() {
  const route = useRoute<RouteProp<ProductsStackParamList, 'ProductDetail'>>();
  const productId = route.params.productId;
  const artwork = ARTWORK_BY_PRODUCT[productId] ?? BRAND.fullDetailBallsImage;

  return <ArtworkDetail artwork={artwork} productId={productId} />;
}

function ArtworkDetail({ artwork, productId }: { artwork: number; productId: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const wishlisted = useWishlistStore((store) => store.productIds.includes(productId));
  const toggleWishlist = useWishlistStore((store) => store.toggle);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.artworkWrap}>
        <Image source={artwork} style={styles.artwork} contentFit="contain" transition={250} />

        {/* Back circle (top-left) */}
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backZone}
        />
        {/* Wishlist heart (top-right) */}
        <Pressable
          onPress={() => toggleWishlist(productId)}
          accessibilityRole="button"
          accessibilityLabel="Toggle wishlist"
          style={styles.heartZone}
        />
        {/* Order on WhatsApp (bottom pill) */}
        <Pressable
          onPress={() => navigation.navigate('WhatsAppOrder', { productId })}
          accessibilityRole="button"
          accessibilityLabel="Order on WhatsApp"
          style={styles.waZone}
        />
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  artworkWrap: {
    width: '100%',
    aspectRatio: 799 / 1825,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  backZone: {
    position: 'absolute',
    top: '2.4%',
    left: '2%',
    width: '12%',
    height: '5.2%',
  },
  heartZone: {
    position: 'absolute',
    top: '2.4%',
    right: '4%',
    width: '10%',
    height: '5.2%',
  },
  waZone: {
    position: 'absolute',
    top: '82.5%',
    left: '4%',
    width: '92%',
    height: '6.5%',
  },
});
