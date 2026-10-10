import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';
import { Text, Botanical, Brand } from './DesignPrimitives';
interface HeaderProps { title?: string; showBack?: boolean; onBack?: () => void; onMenu?: () => void; onNotification?: () => void; onSearch?: () => void; rightAction?: 'bell' | 'search' | 'none'; }
export function Header({ title, showBack, onBack, onMenu, onNotification, onSearch, rightAction = 'bell' }: HeaderProps) {
  const { theme } = useMobileStore();
  return <View style={[styles.header, { height: title ? 65 : 112 }]}>
    <Botanical />
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={showBack ? 'Go back' : 'Open menu'} onPress={showBack ? onBack : onMenu} style={[styles.circle, { backgroundColor: theme.surface }]}>
      <Ionicons name={showBack ? 'chevron-back' : 'menu'} size={25} color={theme.text} />
    </TouchableOpacity>
    {title ? <Text style={[styles.title, { color: theme.text }]}>{title}</Text> : <Brand />}
    {rightAction === 'none' ? <View style={{ width: 40 }} /> : <TouchableOpacity accessibilityRole="button" accessibilityLabel={rightAction === 'search' ? 'Search products' : 'View reviews'} onPress={rightAction === 'search' ? onSearch : onNotification} style={[styles.circle, { backgroundColor: theme.surface }]}>
      <Ionicons name={rightAction === 'search' ? 'search' : 'notifications-outline'} size={23} color={theme.text} />
      {rightAction === 'bell' && <View style={styles.dot} />}
    </TouchableOpacity>}
  </View>;
}
const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }, circle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, title: { fontFamily: 'serif', fontSize: 23, fontWeight: '700', textAlign: 'center', flex: 1 }, dot: { position: 'absolute', right: 9, top: 6, backgroundColor: '#EC1749', width: 6, height: 6, borderRadius: 3 } });

