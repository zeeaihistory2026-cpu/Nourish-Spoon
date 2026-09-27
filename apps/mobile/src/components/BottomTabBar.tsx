import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';

export type MobileTab = 'Home' | 'Products' | 'Reviews' | 'About' | 'More';

interface BottomTabBarProps {
  currentTab?: MobileTab;
  activeTab?: MobileTab;
  onSelectTab?: (tab: MobileTab) => void;
  navigation?: any;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  navigation
}) => {
  const { theme } = useMobileStore();
  const selected = activeTab || currentTab || 'Home';

  const tabs: Array<{ id: MobileTab; label: string; icon: any; activeIcon: any }> = [
    { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'Products', label: 'Products', icon: 'bag-outline', activeIcon: 'bag' },
    { id: 'Reviews', label: 'Reviews', icon: 'heart-outline', activeIcon: 'heart' },
    { id: 'About', label: 'About', icon: 'document-text-outline', activeIcon: 'document-text' },
    { id: 'More', label: 'More', icon: 'person-outline', activeIcon: 'person' },
  ];

  const handlePress = (tabId: MobileTab) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    } else if (navigation?.navigate) {
      navigation.navigate(tabId);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {tabs.map(tab => {
        const isActive = selected === tab.id;
        const iconName = isActive ? tab.activeIcon : tab.icon;
        const color = isActive ? theme.primary : theme.textMuted;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handlePress(tab.id)}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Ionicons name={iconName} size={22} color={color} />
            <Text
              style={[
                styles.tabLabel,
                { color },
                isActive && { fontWeight: '700' }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingBottom: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
  }
});
