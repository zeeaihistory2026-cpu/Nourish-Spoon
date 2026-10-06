import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { ProductsStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { RatingSummary, ratingSummary } from '../../components/common/RatingSummary';
import { ReviewCard } from '../../components/common/ReviewCard';
import { STAR_ICON } from '../../components/common/icons';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Screen } from '../../components/ui/Screen';
import { useProductReviews } from './hooks/useReviews';

export function ProductReviewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight();
  const route = useRoute<RouteProp<ProductsStackParamList, 'ProductReviews'>>();
  const { productId } = route.params;

  const { reviews, state, refresh } = useProductReviews(productId);
  const summary = useMemo(() => ratingSummary(reviews), [reviews]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return (
    <Screen>
      <AppHeader variant="title" title="Reviews" onBack />

      <FlatList
        data={reviews}
        keyExtractor={(review) => review.id}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 16 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ReviewCard review={item} />}
        ListHeaderComponent={
          state === 'ready' && reviews.length > 0 ? (
            <>
              <RatingSummary
                average={summary.average}
                count={summary.count}
                distribution={summary.distribution}
              />
              <View style={styles.writeButton}>
                <Button
                  label="Write a Review"
                  variant="green"
                  height={48}
                  onPress={() =>
                    navigation.navigate('WriteReview', {
                      productId,
                      productName: route.params.productName,
                    })
                  }
                />
              </View>
            </>
          ) : null
        }
        ListEmptyComponent={
          state === 'loading' ? (
            <Loader />
          ) : state === 'error' ? (
            <EmptyState
              icon={STAR_ICON}
              title="Couldn't load reviews"
              message="Please check your connection and try again."
              actionLabel="Retry"
              onAction={() => void refresh()}
            />
          ) : (
            <EmptyState
              icon={STAR_ICON}
              title="No reviews yet"
              message="Be the first to share your experience with this product."
              actionLabel="Write a Review"
              onAction={() =>
                navigation.navigate('WriteReview', {
                  productId,
                  productName: route.params.productName,
                })
              }
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
    paddingBottom: 40,
  },
  writeButton: {
    marginTop: 14,
  },
});
