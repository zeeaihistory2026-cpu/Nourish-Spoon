import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { theme } = useMobileStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: 'Real Ingredients.\nReal Nutrition.',
      subtitle: 'Pure dates, premium roasted nuts, and grassroots churned Desi Ghee. Zero refined sugar or preservatives.',
      image: ASSETS.homeHeroFood,
      badge: '100% Pure & Wholesome'
    },
    {
      title: 'Freshly Made in\nSmall Batches',
      subtitle: 'Handcrafted according to cherished family recipes passed down through generations in Sargodha.',
      image: ASSETS.energyBallsDetailHero,
      badge: 'Traditional Craft'
    },
    {
      title: 'Natural Goodness\nDelivered to You',
      subtitle: 'Enjoy same-day fresh delivery across Sargodha and safe nationwide express delivery across Pakistan.',
      image: ASSETS.panjeeriDetailHero,
      badge: 'Doorstep Delivery'
    }
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header with Skip */}
      <View style={styles.topBar}>
        <View style={styles.leavesLogo}>
          <Ionicons name="leaf" size={16} color={theme.primary} />
          <Text style={[styles.miniBrand, { color: theme.primaryDark }]}>Nourish Spoon</Text>
        </View>

        <TouchableOpacity onPress={onComplete} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Content */}
      <View style={styles.slideBox}>
        {/* Rounded Image with Badge */}
        <View style={[styles.imageContainer, { borderColor: theme.border }]}>
          <Image source={currentSlide.image} style={styles.slideImage} resizeMode="cover" />
          <View style={[styles.slideBadge, { backgroundColor: theme.primaryDark }]}>
            <Text style={styles.slideBadgeText}>{currentSlide.badge}</Text>
          </View>
        </View>

        {/* Text */}
        <View style={styles.textBox}>
          <Text style={[styles.slideTitle, { color: theme.text }]}>
            {currentSlide.title}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textSecondary }]}>
            {currentSlide.subtitle}
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentIndex ? theme.primary : theme.border },
                i === currentIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom CTA Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  leavesLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniBrand: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  slideBox: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    width: width - 48,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  slideBadgeText: {
    color: '#FFF9EC',
    fontSize: 11,
    fontWeight: '700',
  },
  textBox: {
    alignItems: 'center',
    marginTop: 26,
    paddingHorizontal: 10,
  },
  slideTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  slideSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
  },
  bottomBar: {
    paddingBottom: 10,
  },
  nextButton: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D5428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFF9EC',
    fontSize: 15,
    fontWeight: '700',
  },
});
