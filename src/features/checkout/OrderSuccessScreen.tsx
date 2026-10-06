import { Check, Package } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { StackActions, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../app/navigation/navigationTypes';
import { OrderTimeline } from '../orders/components/OrderTimeline';
import { Button } from '../../components/ui/Button';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { formatPrice } from '../../utils/currency';
import { colors } from '../../theme';

export function OrderSuccessScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderSuccess'>>();

  return (
    <Screen centered>
      <View style={styles.body}>
        <View style={styles.icon}>
          <Check size={44} color={colors.goldDark} strokeWidth={2.4} />
        </View>
        <AppText variant="authTitle" color="greenDark" style={styles.title}>
          Order Placed!
        </AppText>
        <AppText variant="body" color="textMid" style={styles.message}>
          Thank you for ordering. Your handcrafted goodness is being packed with love.
        </AppText>
        <View style={styles.orderNumber}>
          <Package size={14} color={colors.greenMid} strokeWidth={2} />
          <AppText variant="captionMedium" color="greenMid">
            {route.params.orderNumber} · {formatPrice(route.params.total)}
          </AppText>
        </View>

        <OrderTimeline status="placed" />

        <View style={styles.actions}>
          <Button
            label="Track Order"
            variant="green"
            onPress={() =>
              navigation.dispatch(
                StackActions.replace('OrderDetail', { orderId: route.params.orderId })
              )
            }
          />
          <Button
            label="Continue Shopping"
            variant="outline"
            onPress={() => navigation.dispatch(StackActions.popToTop())}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 22,
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 300,
  },
  orderNumber: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.checkbox,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  actions: {
    marginTop: 30,
    width: '100%',
    gap: 11,
  },
});
