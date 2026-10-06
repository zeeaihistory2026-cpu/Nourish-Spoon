import { Image } from 'expo-image';
import { MapPin, Package } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { SectionHeader } from '../../components/common/SectionHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { OrderTimeline } from './components/OrderTimeline';
import { useOrder } from './hooks/useOrders';
import { PAYMENT_METHOD_LABELS } from '../../constants';
import { colors, radius, shadows } from '../../theme';
import { formatDate } from '../../utils/date';
import { formatPrice } from '../../utils/currency';

export function OrderDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetail'>>();
  const { order, state } = useOrder(route.params.orderId);

  if (state === 'loading') {
    return (
      <Screen>
        <AppHeader variant="title" title="Order" onBack />
        <Loader />
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen>
        <AppHeader variant="title" title="Order" onBack />
        <EmptyState
          icon={<Package size={30} color={colors.goldDark} strokeWidth={1.8} />}
          title="Order unavailable"
          message="We couldn't load this order. Please try again."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader variant="title" title={`Order ${order.orderNumber}`} onBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.topRow}>
            <AppText variant="cardTitle" style={styles.orderId}>
              {order.orderNumber}
            </AppText>
            <StatusBadge status={order.orderStatus} />
          </View>
          <AppText variant="smallLight" color="textLight">
            Placed {formatDate(order.createdAt)} · {PAYMENT_METHOD_LABELS[order.paymentMethod]}
          </AppText>
          <OrderTimeline status={order.orderStatus} />
        </View>

        <SectionHeader title="Items" />
        {order.items.map((item) => (
          <View key={`${item.productId}|${item.weight}`} style={styles.itemCard}>
            <View style={styles.thumb}>
              <Image
                source={item.image}
                style={styles.thumbImage}
                contentFit="contain"
                transition={150}
                recyclingKey={item.productId}
              />
            </View>
            <View style={styles.itemMid}>
              <AppText variant="cardTitleSmall" color="text" numberOfLines={1}>
                {item.name}
              </AppText>
              <AppText variant="smallLight" color="textLight">
                {item.weight} · {formatPrice(item.price)} each
              </AppText>
              {order.orderStatus === 'delivered' ? (
                <Pressable
                  onPress={() =>
                    navigation.navigate('Main', {
                      screen: 'Products',
                      params: {
                        screen: 'WriteReview',
                        params: { productId: item.productId, productName: item.name },
                      },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Write a review for ${item.name}`}
                  style={({ pressed }) => [styles.reviewButton, pressed && styles.reviewPressed]}
                >
                  <AppText variant="smallMedium" color="goldDark">
                    Write a Review
                  </AppText>
                </Pressable>
              ) : null}
            </View>
            <AppText variant="cardTitleSmall" color="textMid">
              × {item.qty}
            </AppText>
          </View>
        ))}

        <SectionHeader title="Delivery Address" />
        <View style={styles.addressCard}>
          <View style={styles.addressIcon}>
            <MapPin size={18} color={colors.goldDark} strokeWidth={2} />
          </View>
          <View style={styles.addressBody}>
            <AppText variant="cardTitleSmall" color="text">
              {order.shippingAddress.label} — {order.shippingAddress.fullName}
            </AppText>
            <AppText variant="small" color="textLight">
              {order.shippingAddress.line1}, {order.shippingAddress.city} ·{' '}
              {order.shippingAddress.phone}
            </AppText>
          </View>
        </View>

        <SectionHeader title="Summary" />
        <View style={styles.summary}>
          <View style={styles.sumRow}>
            <AppText variant="caption" color="textMid">
              Subtotal
            </AppText>
            <AppText variant="caption" color="textMid">
              {formatPrice(order.subtotal)}
            </AppText>
          </View>
          <View style={styles.sumRow}>
            <AppText variant="caption" color="textMid">
              Delivery
            </AppText>
            <AppText variant="caption" color="textMid">
              {order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}
            </AppText>
          </View>
          <View style={[styles.sumRow, styles.sumTotal]}>
            <AppText variant="bodySemibold" color="greenDark">
              Total
            </AppText>
            <AppText variant="bodySemibold" color="greenDark">
              {formatPrice(order.total)}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    fontWeight: '600',
    color: colors.text,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 12,
    marginTop: 4,
    ...shadows.sm,
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
  itemMid: {
    flex: 1,
  },
  reviewButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.goldDark,
    minHeight: 32,
    justifyContent: 'center',
  },
  reviewPressed: {
    opacity: 0.7,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 13,
    ...shadows.sm,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBody: {
    flex: 1,
  },
  summary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 4,
    ...shadows.sm,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  sumTotal: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: colors.borderSoft,
    marginTop: 8,
    paddingTop: 11,
  },
});
