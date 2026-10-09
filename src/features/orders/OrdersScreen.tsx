import { Image } from 'expo-image';
import { ChevronRight, Package } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from '../../app/navigation/navigationTypes';
import { BRAND } from '../../constants';
import { AppHeader } from '../../components/common/AppHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useOrders } from './hooks/useOrders';
import { colors, radius, shadows } from '../../theme';
import { formatDate } from '../../utils/date';
import { formatPrice } from '../../utils/currency';
import type { Order } from '../../types/order';

export function OrdersScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { orders, state, refresh } = useOrders();

  useFocusEffect(() => {
    void refresh();
  });

  const dateLabel = (order: Order) => {
    const prefix = order.orderStatus === 'delivered' ? 'Delivered' : 'Placed';
    return `${prefix} ${formatDate(order.createdAt)}`;
  };

  return (
    <Screen>
      <AppHeader variant="title" title="My Orders" onBack />

      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={`Order ${item.orderNumber}`}
          >
            <View style={styles.cardTop}>
              <AppText variant="cardTitleSmall" style={styles.orderId}>
                {item.orderNumber}
              </AppText>
              <StatusBadge status={item.orderStatus} />
            </View>
            <View style={styles.cardMid}>
              <View style={styles.thumb}>
                <Image
                  source={item.items[0]?.image ?? BRAND.energyBallsImage}
                  style={styles.thumbImage}
                  contentFit="contain"
                  transition={150}
                />
              </View>
              <View style={styles.midText}>
                <AppText variant="cardTitleSmall" color="text" numberOfLines={1}>
                  {item.items[0]?.name ?? 'Order items'}
                  {item.items.length > 1 ? ` +${item.items.length - 1} more` : ''}
                  {item.items.length === 1 ? ` × ${item.items[0]?.qty}` : ''}
                </AppText>
                <AppText variant="smallLight" color="textLight">
                  {dateLabel(item)}
                </AppText>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <AppText variant="cardTitle" color="goldDark">
                {formatPrice(item.total)}
              </AppText>
              <ChevronRight size={18} color={colors.chevron} strokeWidth={2} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          state === 'loading' ? (
            <Loader />
          ) : state === 'error' ? (
            <EmptyState
              icon={<Package size={30} color={colors.goldDark} strokeWidth={1.8} />}
              title="Couldn't load your orders"
              message="We couldn't load your orders. Please try again."
              actionLabel="Retry"
              onAction={() => void refresh()}
            />
          ) : (
            <EmptyState
              icon={<Package size={30} color={colors.goldDark} strokeWidth={1.8} />}
              title="No orders yet"
              message="Your handcrafted orders will appear here."
              actionLabel="Browse Products"
              onAction={() => navigation.navigate('Main', { screen: 'Products' })}
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
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 13,
    marginTop: 12,
    ...shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontWeight: '600',
    color: colors.text,
  },
  cardMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 11,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.imageBg,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  midText: {
    flex: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 11,
    paddingTop: 10,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: colors.borderSoft,
  },
});
