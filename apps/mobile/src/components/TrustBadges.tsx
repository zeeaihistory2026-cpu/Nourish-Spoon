import { Text } from './DesignPrimitives';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';

interface TrustBadgesProps {
  variant?: 'home' | 'product';
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ variant = 'home' }) => {
  const { theme } = useMobileStore();

  const badges = variant === 'home' ? [
    { title: 'No\nPreservatives', icon: 'leaf-outline', lib: 'ionicons' },
    { title: '100%\nNatural', icon: 'sprout-outline', lib: 'material' },
    { title: 'Small\nBatch', icon: 'flower-outline', lib: 'ionicons' },
    { title: 'Airtight\nPacked', icon: 'archive-outline', lib: 'ionicons' },
  ] : [
    { title: 'Freshly\nMade', icon: 'leaf-outline', lib: 'ionicons' },
    { title: 'Airtight\nPacked', icon: 'archive-outline', lib: 'ionicons' },
    { title: 'No\nPreservatives', icon: 'flask-outline', lib: 'ionicons' },
    { title: '100%\nNatural', icon: 'sprout-outline', lib: 'material' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceWarm, borderColor: theme.border }]}>
      {badges.map((b, i) => (
        <View key={i} style={styles.badgeItem}>
          <View style={[styles.iconCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {b.lib === 'material' ? (
              <MaterialCommunityIcons name={b.icon as any} size={20} color={theme.primary} />
            ) : (
              <Ionicons name={b.icon as any} size={19} color={theme.primary} />
            )}
          </View>
          <Text style={[styles.badgeTitle, { color: theme.text }]}>
            {b.title}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  badgeItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
  },
});
