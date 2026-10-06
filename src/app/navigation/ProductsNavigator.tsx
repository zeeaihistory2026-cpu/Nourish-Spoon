import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProductDetailScreen } from '../../features/products/ProductDetailScreen';
import { ShopScreen } from '../../features/products/ShopScreen';
import { ProductReviewsScreen } from '../../features/reviews/ProductReviewsScreen';
import { WriteReviewScreen } from '../../features/reviews/WriteReviewScreen';
import { WhatsAppOrderScreen } from '../../features/checkout/WhatsAppOrderScreen';
import type { ProductsStackParamList } from './navigationTypes';

const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();

export function ProductsNavigator() {
  return (
    <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductsStack.Screen name="ProductsList" component={ShopScreen} />
      <ProductsStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <ProductsStack.Screen name="ProductReviews" component={ProductReviewsScreen} />
      <ProductsStack.Screen name="WriteReview" component={WriteReviewScreen} />
      <ProductsStack.Screen name="WhatsAppOrder" component={WhatsAppOrderScreen} />
    </ProductsStack.Navigator>
  );
}
