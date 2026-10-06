import { Heart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { ProductCard } from '../../components/common/ProductCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { GridSkeleton } from '../../components/ui/Loader';
import { Screen } from '../../components/ui/Screen';
import { fetchProductsByIds } from '../products/services/productService';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { trackAddToCart } from '../../services/analytics/events';
import { colors } from '../../theme';
import type { Product } from '../../types/product';

export function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const productIds = useWishlistStore((state) => state.productIds);
  const addItem = useCartStore((store) => store.addItem);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const idsKey = productIds.join(',');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const ids = idsKey ? idsKey.split(',') : [];
    fetchProductsByIds(ids)
      .then((result) => {
        if (!cancelled) {
          // Preserve the wishlist order.
          const byId = new Map(result.map((product) => [product.id, product]));
          setProducts(ids.map((id) => byId.get(id)).filter(Boolean) as Product[]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return (
    <Screen>
      <AppHeader variant="title" title="Wishlist" onBack />

      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              (navigation.navigate as unknown as (
                name: string,
                params?: object
              ) => void)('Products', {
                screen: 'ProductDetail',
                params: { productId: item.id },
              })
            }
            onAddToCart={(variant) => {
              addItem(item, variant, 1);
              trackAddToCart(item.id, 1, variant.price);
            }}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <GridSkeleton count={2} />
          ) : (
            <EmptyState
              icon={<Heart size={30} color={colors.goldDark} strokeWidth={1.8} />}
              title="Your wishlist is empty"
              message="Tap the heart on any product to save it for later."
              actionLabel="Browse Products"
              onAction={() => navigation.goBack()}
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  column: {
    gap: 12,
  },
});
