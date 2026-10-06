import { Bell } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useNotifications } from '../notifications/hooks/useNotifications';
import { colors, radius, shadows } from '../../theme';
import { timeAgo } from '../../utils/date';
import type { AppNotification } from '../../types/user';

export function NotificationsScreen() {
  const { items, state, refresh, markAllRead } = useNotifications();

  return (
    <Screen>
      <AppHeader
        variant="title"
        title="Notifications"
        onBack
        rightIcon={<AppText variant="captionMedium" color="goldDark">Mark all read</AppText>}
        onRightPress={() => void markAllRead()}
        rightAccessibilityLabel="Mark all notifications read"
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationRow notification={item} />}
        ListEmptyComponent={
          state === 'loading' ? (
            <Loader />
          ) : state === 'error' ? (
            <EmptyState
              icon={<Bell size={30} color={colors.goldDark} strokeWidth={1.8} />}
              title="Couldn't load notifications"
              message="Please check your connection and try again."
              actionLabel="Retry"
              onAction={() => void refresh()}
            />
          ) : (
            <EmptyState
              icon={<Bell size={30} color={colors.goldDark} strokeWidth={1.8} />}
              title="No notifications yet"
              message="Order updates and offers will show up here."
            />
          )
        }
      />
    </Screen>
  );
}

function NotificationRow({ notification }: { notification: AppNotification }) {
  return (
    <View style={[styles.row, !notification.read && styles.rowUnread]}>
      <View style={styles.dotColumn}>
        <View style={[styles.dot, notification.read && styles.dotRead]} />
      </View>
      <View style={styles.body}>
        <AppText variant="cardTitleSmall" color="text">
          {notification.title}
        </AppText>
        <AppText variant="small" color="textMid">
          {notification.body}
        </AppText>
        <AppText variant="microRegular" color="textLight" style={styles.time}>
          {timeAgo(notification.createdAt)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 13,
    marginTop: 12,
    ...shadows.sm,
  },
  rowUnread: {
    borderColor: 'rgba(201, 168, 76, 0.55)',
    backgroundColor: colors.goldBg,
  },
  dotColumn: {
    paddingTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  dotRead: {
    backgroundColor: colors.chevron,
  },
  body: {
    flex: 1,
  },
  time: {
    marginTop: 6,
  },
});
