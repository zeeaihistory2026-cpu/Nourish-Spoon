import { Image } from 'expo-image';
import { ShoppingBag, Trash2 } from 'lucide-react-native';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from '../../app/navigation/navigationTypes';
import { BRAND } from '../../constants';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomBar } from '../../components/common/BottomBar';
import { QtyStepper } from '../../components/common/QtyStepper';
import { SumCard } from '../../components/common/SumCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { cartItemKey, cartTotals, useCartStore } from '../../store/cartStore';
import { trackBeginCheckout, trackRemoveFromCart } from '../../services/analytics/events';
import { colors, radius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';

export function CartScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const items = useCartStore((store) => store.items);
  const increment = useCartStore((store) => store.increment);
  const decrement = useCartStore((store) => store.decrement);
  const removeItem = useCartStore((store) => store.removeItem);

  const totals = useMemo(() => cartTotals(items), [items]);

  return (
    <Screen>
      <AppHeader variant="title" title="My Cart" onBack />

      {items.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState
            icon={<ShoppingBag size={30} color={colors.goldDark} strokeWidth={1.8} />}
            title="Your cart is empty"
            message="Looks like you haven't added anything yet."
            actionLabel="Browse Products"
            onAction={() => navigation.navigate('Main', { screen: 'Products' })}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => cartItemKey(item.productId, item.variantLabel)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.thumb}>
                  <Image
                    source={item.image || BRAND.energyBallsImage}
                    style={styles.thumbImage}
                    contentFit="contain"
                    transition={150}
                    recyclingKey={item.productId}
                  />
                </View>
                <View style={styles.mid}>
                  <View style={styles.titleRow}>
                    <AppText variant="cardTitle" color="text" numberOfLines={1}>
                      {item.name}
                    </AppText>
                    <Pressable
                      onPress={() => {
                        removeItem(cartItemKey(item.productId, item.variantLabel));
                        trackRemoveFromCart(item.productId);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.name} from cart`}
                      hitSlop={15}
                    >
                      <Trash2 size={15} color={colors.chevron} strokeWidth={2} />
                    </Pressable>
                  </View>
                  <AppText variant="smallLight" color="textLight">
                    {item.variantLabel}
                  </AppText>
                  <AppText variant="cardTitleSmall" color="goldDark" style={styles.price}>
                    {formatPrice(item.price)}
                  </AppText>
                </View>
                <QtyStepper
                  value={item.qty}
                  onDecrement={() => decrement(cartItemKey(item.productId, item.variantLabel))}
                  onIncrement={() => increment(cartItemKey(item.productId, item.variantLabel))}
                />
              </View>
            )}
            ListFooterComponent={<SumCard subtotal={totals.subtotal} deliveryFee={totals.deliveryFee} />}
          />

          <BottomBar>
            <View style={styles.total}>
              <AppText variant="small" color="textLight">
                Total payable
              </AppText>
              <AppText variant="stat" color="greenDark">
                {formatPrice(totals.total)}
              </AppText>
            </View>
            <View style={styles.checkoutButton}>
              <Button
                label="Checkout"
                variant="green"
                height={48}
                onPress={() => {
                  trackBeginCheckout(totals.total, totals.count);
                  navigation.navigate('Checkout');
                }}
              />
            </View>
          </BottomBar>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 10,
    marginTop: 12,
    ...shadows.sm,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.imageBg,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  mid: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    marginTop: 4,
  },
  total: {
    flex: 1,
  },
  checkoutButton: {
    flex: 1.2,
  },
});
