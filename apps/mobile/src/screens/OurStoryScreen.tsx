import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';
import { BottomTabBar } from '../components/BottomTabBar';

interface OurStoryScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export const OurStoryScreen: React.FC<OurStoryScreenProps> = ({ navigation }) => {
  const { currentTheme, settings } = useStore();
  const colors = currentTheme;

  const steps = [
    {
      step: 1,
      title: 'Source Premium Ingredients',
      description: 'We carefully select the finest nuts, dates and natural ingredients.',
      icon: '🌿',
    },
    {
      step: 2,
      title: 'Prepare Fresh',
      description: 'Our traditional family recipes are prepared in small batches for the best taste.',
      icon: '🥣',
    },
    {
      step: 3,
      title: 'Pack Airtight',
      description: 'Hygienically packed to lock in freshness and natural nutrition.',
      icon: '🫙',
    },
    {
      step: 4,
      title: 'Deliver to You',
      description: 'Freshly made and delivered direct to your doorstep across Pakistan.',
      icon: '🚚',
    },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'Only the best ingredients make it to our jars.',
      icon: '🛡️',
    },
    {
      title: 'Honest Nutrition',
      description: 'Real ingredients. No shortcuts. No refined sugar.',
      icon: '🌱',
    },
    {
      title: 'Made with Love',
      description: 'Crafted with care, just like our family recipes.',
      icon: '❤️',
    },
    {
      title: 'Natural Always',
      description: '100% natural, wholesome ingredients.',
      icon: '🍃',
    },
    {
      title: 'Transparent',
      description: 'We believe in honesty, from our kitchen to your home.',
      icon: '👥',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.isDark ? 'light-content' : 'dark-content'} />

      {/* Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.() || navigation?.navigate('Home')}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.backBtnText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Our Story</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Founder Hero Image with Floating Quote */}
        <View style={styles.heroContainer}>
          <Image
            source={ASSETS.founderStoryHero}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Quote Card */}
          <View style={[styles.quoteCard, { backgroundColor: 'rgba(255, 249, 236, 0.95)', borderColor: '#EBDCB9' }]}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={[styles.quoteText, { color: colors.primary }]}>
              We make every jar as if it's going to our own family.
              <Text style={styles.quoteMarkEnd}> ”</Text>
            </Text>
            <View style={styles.quoteDivider} />
            <Text style={[styles.founderName, { color: colors.primary }]}>Tayyaba</Text>
            <Text style={styles.founderRole}>Nourish Spoon</Text>
            <Text style={styles.founderLocation}>Sargodha, Pakistan</Text>
          </View>
        </View>

        {/* Narrative Card */}
        <View style={[styles.narrativeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.narrativeHeading, { color: colors.primary }]}>
            A Story of Family, Food & Purpose
          </Text>
          <Text style={[styles.narrativeBody, { color: colors.textSecondary }]}>
            Nourish Spoon was born from recipes passed down from my mother and grandmother — timeless traditions made with real, natural ingredients. What started in our home kitchen in Sargodha has grown into a mission to share the same warmth, nourishment and goodness with families across Pakistan. Every jar carries a piece of our family’s love, crafted for yours.
          </Text>
        </View>

        {/* How We Make It Section */}
        <View style={[styles.sectionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>How We Make It</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.processList}
          >
            {steps.map((item, index) => (
              <React.Fragment key={item.step}>
                <View style={[styles.processCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.processIconCircle, { backgroundColor: '#EBF5EE', borderColor: '#D1E7DD' }]}>
                    <Text style={styles.processIcon}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.processCardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.processCardDesc, { color: colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
                {index < steps.length - 1 && (
                  <View style={styles.arrowContainer}>
                    <Text style={[styles.arrowText, { color: colors.accent }]}>›</Text>
                  </View>
                )}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Our Values Section */}
        <View style={[styles.sectionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Our Values</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.valuesList}
          >
            {values.map((val, idx) => (
              <View key={idx} style={[styles.valueCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.valueIconCircle, { backgroundColor: '#FFF4E5', borderColor: '#FDE2BF' }]}>
                  <Text style={styles.valueIcon}>{val.icon}</Text>
                </View>
                <Text style={[styles.valueTitle, { color: colors.text }]}>{val.title}</Text>
                <Text style={[styles.valueDesc, { color: colors.textSecondary }]}>
                  {val.description}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* WhatsApp Consultation Banner */}
        <TouchableOpacity
          style={[styles.whatsappBanner, { backgroundColor: '#073B21' }]}
          onPress={() => navigation?.navigate('WhatsAppOrder', { source: 'story' })}
          activeOpacity={0.9}
        >
          <View style={styles.whatsappBannerContent}>
            <Text style={styles.whatsappBannerTitle}>Have questions for our kitchen?</Text>
            <Text style={styles.whatsappBannerSub}>
              Tayyaba and our team are just a message away on WhatsApp.
            </Text>
            <View style={styles.whatsappBannerBtn}>
              <Text style={styles.whatsappBannerBtnText}>Chat with Us on WhatsApp 💬</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="About" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '300',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  heroContainer: {
    width: '100%',
    height: 360,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  quoteCard: {
    position: 'absolute',
    right: 16,
    top: 30,
    width: width * 0.52,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  quoteMark: {
    fontSize: 28,
    lineHeight: 28,
    color: '#C99B36',
    fontWeight: '700',
    fontFamily: 'serif',
  },
  quoteMarkEnd: {
    fontSize: 20,
    color: '#C99B36',
    fontWeight: '700',
    fontFamily: 'serif',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    fontWeight: '600',
    marginVertical: 4,
  },
  quoteDivider: {
    height: 1,
    backgroundColor: '#E4CF9A',
    marginVertical: 8,
    width: '40%',
  },
  founderName: {
    fontSize: 14,
    fontWeight: '800',
  },
  founderRole: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  founderLocation: {
    fontSize: 10,
    color: '#888',
  },
  narrativeCard: {
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  narrativeHeading: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'serif',
    marginBottom: 10,
    lineHeight: 28,
  },
  narrativeBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 16,
  },
  processList: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  processCard: {
    width: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  processIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  processIcon: {
    fontSize: 24,
  },
  processCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 32,
  },
  processCardDesc: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  arrowContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 26,
    fontWeight: '800',
  },
  valuesList: {
    paddingHorizontal: 14,
  },
  valueCard: {
    width: 135,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
  },
  valueIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  valueIcon: {
    fontSize: 22,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  valueDesc: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  whatsappBanner: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  whatsappBannerContent: {
    alignItems: 'center',
  },
  whatsappBannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 6,
  },
  whatsappBannerSub: {
    color: '#D1E7DD',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
  },
  whatsappBannerBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  whatsappBannerBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
