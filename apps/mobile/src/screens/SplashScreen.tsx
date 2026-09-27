import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { theme } = useMobileStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Decorative leaf motifs */}
      <View style={styles.topLeafLeft}>
        <Ionicons name="leaf-outline" size={80} color={theme.primary} style={{ opacity: 0.12 }} />
      </View>
      <View style={styles.bottomLeafRight}>
        <Ionicons name="leaf-outline" size={90} color={theme.primary} style={{ opacity: 0.12, transform: [{ scaleX: -1 }] }} />
      </View>

      <Animated.View style={[styles.centerBox, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Leaves Icon Header */}
        <View style={styles.leavesLogo}>
          <Ionicons name="leaf" size={26} color={theme.primary} />
          <Ionicons name="leaf" size={26} color={theme.primaryDark} style={{ marginLeft: -4 }} />
        </View>

        <Text style={[styles.brandName, { color: theme.primaryDark }]}>
          Nourish Spoon
        </Text>

        <Text style={[styles.tagline, { color: theme.gold }]}>
          Crafted with Love
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.gold }]} />

        <Text style={[styles.proposition, { color: theme.textSecondary }]}>
          Handcrafted Nutrition • Real Ingredients • Pure Love
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topLeafLeft: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  bottomLeafRight: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  centerBox: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  leavesLogo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  brandName: {
    fontFamily: 'serif',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: 4,
  },
  divider: {
    width: 48,
    height: 1.5,
    marginVertical: 18,
    borderRadius: 1,
    opacity: 0.7,
  },
  proposition: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
