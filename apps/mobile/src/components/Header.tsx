import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  onNotification?: () => void;
  onSearch?: () => void;
  rightAction?: 'bell' | 'search' | 'none';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onMenu,
  onNotification,
  onSearch,
  rightAction = 'bell'
}) => {
  const { theme } = useMobileStore();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      {/* Botanical leaves accents in corners */}
      <View style={styles.leafLeft}>
        <Ionicons name="leaf-outline" size={28} color={theme.primary} style={{ opacity: 0.15 }} />
      </View>
      <View style={styles.leafRight}>
        <Ionicons name="leaf-outline" size={28} color={theme.primary} style={{ opacity: 0.15, transform: [{ scaleX: -1 }] }} />
      </View>

      {/* Left button */}
      {showBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={[styles.circleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onMenu}
          style={[styles.circleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={20} color={theme.text} />
        </TouchableOpacity>
      )}

      {/* Center Branding or Title */}
      {title ? (
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          {title}
        </Text>
      ) : (
        <View style={styles.brandCenter}>
          <View style={styles.leavesLogo}>
            <Ionicons name="leaf" size={14} color={theme.primary} />
            <Ionicons name="leaf" size={14} color={theme.primaryDark} style={{ marginLeft: -3 }} />
          </View>
          <Text style={[styles.brandName, { color: theme.primaryDark }]}>
            Nourish Spoon
          </Text>
          <Text style={[styles.tagline, { color: theme.gold }]}>
            Crafted with Love
          </Text>
        </View>
      )}

      {/* Right button */}
      {rightAction === 'bell' ? (
        <TouchableOpacity
          onPress={onNotification}
          style={[styles.circleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={18} color={theme.text} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      ) : rightAction === 'search' ? (
        <TouchableOpacity
          onPress={onSearch}
          style={[styles.circleButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={18} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 10,
  },
  leafLeft: {
    position: 'absolute',
    top: 5,
    left: 10,
    pointerEvents: 'none',
  },
  leafRight: {
    position: 'absolute',
    top: 5,
    right: 10,
    pointerEvents: 'none',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  brandCenter: {
    alignItems: 'center',
  },
  leavesLogo: {
    flexDirection: 'row',
    marginBottom: -2,
  },
  brandName: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagline: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 11,
    marginTop: -1,
  },
  screenTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
  },
});
