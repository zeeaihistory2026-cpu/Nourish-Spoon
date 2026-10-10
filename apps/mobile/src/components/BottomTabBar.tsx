import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';
import { Text } from './DesignPrimitives';
export type MobileTab = 'Home' | 'Products' | 'Reviews' | 'About' | 'More';
export function BottomTabBar({ currentTab, activeTab, onSelectTab, navigation }: { currentTab?: MobileTab; activeTab?: MobileTab; onSelectTab?: (tab: MobileTab) => void; navigation?: any }) {
  const { theme } = useMobileStore();
  const selected = activeTab || currentTab || 'Home';
  const tabs: { id: MobileTab; icon: any; active: any }[] = [
    { id: 'Home', icon: 'home-outline', active: 'home' }, { id: 'Products', icon: 'bag-outline', active: 'bag' }, { id: 'Reviews', icon: 'heart-outline', active: 'heart' }, { id: 'About', icon: 'document-text-outline', active: 'document-text' }, { id: 'More', icon: 'person-outline', active: 'person' },
  ];
  return <View style={[styles.bar, { backgroundColor: theme.surface, borderColor: theme.border }]}>{tabs.map(t => <TouchableOpacity key={t.id} accessibilityRole="tab" accessibilityState={{ selected: selected === t.id }} accessibilityLabel={t.id} onPress={() => onSelectTab ? onSelectTab(t.id) : navigation?.navigate(t.id)} style={styles.tab}>
    <Ionicons name={selected === t.id ? t.active : t.icon} size={24} color={selected === t.id ? theme.primary : theme.textSecondary} />
    <Text style={{ fontSize: 11, marginTop: 3, color: selected === t.id ? theme.primary : theme.textSecondary, fontWeight: selected === t.id ? '700' : '400' }}>{t.id}</Text>
  </TouchableOpacity>)}</View>;
}
const styles = StyleSheet.create({ bar: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 7, paddingBottom: 5, minHeight: 58 }, tab: { flex: 1, alignItems: 'center', justifyContent: 'center' } });

