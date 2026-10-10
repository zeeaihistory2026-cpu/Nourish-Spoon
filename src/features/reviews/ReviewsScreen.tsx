import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight, type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { MainTabParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { CategoryChips } from '../../components/common/CategoryChips';
import { ReviewCard } from '../../components/common/ReviewCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { STAR_ICON } from '../../components/common/icons';
import { useRecentReviews, useReviewStats } from './hooks/useReviews';
import { DrawerMenu } from '../../components/common/DrawerMenu';
import { colors } from '../../theme';

const FILTERS = ['All', 'Energy Balls', 'Panjeeri'];

export function ReviewsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const tabBarHeight = useBottomTabBarHeight();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const { reviews, state, refresh } = useRecentReviews(20);

  const filtered = useMemo(() => {
    if (filter === 'All') {
      return reviews;
    }
    return reviews.filter(
      (review) =>
        review.productName.toLowerCase().includes(filter.replace('Energy Balls', 'energy balls').toLowerCase()) ||
        review.productName.toLowerCase().includes(filter.toLowerCase().replace('panjeeri', 'panjeeri'))
    );
  }, [filter, reviews]);

  return (
    <Screen>
      <AppHeader variant="home" onMenu={() => setDrawerOpen(true)} leaves={false} />

      <FlatList
        data={filtered}
        keyExtractor={(review) => review.id}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + 16 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ReviewCard review={item} />}
        ListHeaderComponent={
          <View>
            <AppText variant="sectionTitleBig" color="greenDark" style={styles.pageTitle}>
              Customer Reviews
            </AppText>
            <AppText variant="body" color="textMid" style={styles.pageSubtitle}>
              Real stories. Real nutrition. Real love.
            </AppText>
            <View style={styles.chips}>
              <CategoryChips categories={FILTERS} value={filter} onChange={setFilter} />
            </View>
          </View>
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
              title={filter === 'All' ? 'No reviews yet' : `No ${filter} reviews`}
              message="Reviews from verified buyers will appear here."
              actionLabel="Browse Products"
              onAction={() => navigation.navigate('Products')}
            />
          )
        }
      />

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  pageTitle: {
    textAlign: 'center',
    marginTop: 2,
  },
  pageSubtitle: {
    textAlign: 'center',
    marginTop: 3,
  },
  chips: {
    marginTop: 14,
    marginBottom: 2,
  },
});
