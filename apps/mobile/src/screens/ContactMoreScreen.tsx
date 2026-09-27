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
  Linking,
  Alert,
} from 'react-native';
import { useStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';
import { BottomTabBar } from '../components/BottomTabBar';

interface ContactMoreScreenProps {
  navigation: any;
}

export const ContactMoreScreen: React.FC<ContactMoreScreenProps> = ({ navigation }) => {
  const { currentTheme, settings, toggleTheme } = useStore();
  const colors = currentTheme;
  const isDark = colors.isDark;

  const handleWhatsApp = () => {
    const phone = settings.whatsapp_number.replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      'Assalam-o-Alaikum Nourish Spoon! I would like to inquire about your products.'
    )}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://wa.me/${phone}`);
      }
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${settings.whatsapp_number}`).catch(() => {
      Alert.alert('Phone Call', `Call us directly at ${settings.whatsapp_number}`);
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${settings.contact_email}`).catch(() => {
      Alert.alert('Email Us', `Email us at ${settings.contact_email}`);
    });
  };

  const handleInstagram = () => {
    Linking.openURL('https://instagram.com/nourishspoon').catch(() => {
      Alert.alert('Instagram', 'Follow us on Instagram: @nourishspoon');
    });
  };

  const handleLocation = () => {
    Linking.openURL('https://maps.google.com/?q=Sargodha,Punjab,Pakistan').catch(() => {
      Alert.alert('Location', settings.business_address);
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation?.openDrawer?.() || navigation?.navigate('Home')}
          style={[styles.menuBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.menuBtnText, { color: colors.text }]}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Contact & More</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Card */}
        <View style={[styles.bannerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.bannerTextCol}>
            <Text style={[styles.bannerHeadline, { color: colors.primary }]}>
              We'd love to hear from you.
            </Text>
            <Text style={[styles.bannerSubtext, { color: colors.textSecondary }]}>
              For orders, inquiries or bulk/gift orders, feel free to contact us. Our team is always here to help!
            </Text>
          </View>
          <Image
            source={ASSETS.homeHeroFood}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Section: Get in Touch */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Get in Touch</Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Chat on WhatsApp */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleWhatsApp}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#25D366' }]}>
              <Text style={styles.iconSymbol}>💬</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Chat on WhatsApp</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                {settings.whatsapp_number}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Call Us */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F0E8D9' }]}>
              <Text style={styles.iconSymbolDark}>📞</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Call Us</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                {settings.whatsapp_number}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Email Us */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F0E8D9' }]}>
              <Text style={styles.iconSymbolDark}>✉️</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Email Us</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                {settings.contact_email}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Our Location */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleLocation}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#073B21' }]}>
              <Text style={styles.iconSymbol}>📍</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Our Location</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                {settings.business_address}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Business Hours */}
          <View style={styles.listItem}>
            <View style={[styles.iconBox, { backgroundColor: '#F0E8D9' }]}>
              <Text style={styles.iconSymbolDark}>⏰</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Business Hours</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                {settings.business_hours}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Follow on Instagram */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={handleInstagram}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E1306C' }]}>
              <Text style={styles.iconSymbol}>📷</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Follow on Instagram</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                @nourishspoon
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Section: More */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>More</Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* FAQ */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation?.navigate('FAQ')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F0E8D9' }]}>
              <Text style={styles.iconSymbolDark}>❓</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>FAQ</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                Get answers to common questions
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* About Nourish Spoon */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation?.navigate('About')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F0E8D9' }]}>
              <Text style={styles.iconSymbolDark}>ℹ️</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>About Nourish Spoon</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                Our story, values and what makes us special
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Order on WhatsApp */}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation?.navigate('WhatsAppOrder', {})}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: '#25D366' }]}>
              <Text style={styles.iconSymbol}>💬</Text>
            </View>
            <View style={styles.itemTextCol}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Order on WhatsApp</Text>
              <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                Quick and easy ordering
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Appearance */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance</Text>
        </View>

        <View style={[styles.appearanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconBox, { backgroundColor: '#F0E8D9', marginRight: 12 }]}>
            <Text style={styles.iconSymbolDark}>{isDark ? '🌙' : '☀️'}</Text>
          </View>
          <View style={styles.appearanceTextCol}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>Appearance</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
              Choose your preferred app theme.
            </Text>
          </View>
          
          {/* Segmented Control */}
          <View style={[styles.segmentedCtrl, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => isDark && toggleTheme()}
              style={[
                styles.segmentBtn,
                !isDark && { backgroundColor: '#073B21' },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentIcon, !isDark && { color: '#FFF' }]}>☀️</Text>
              <Text style={[styles.segmentText, !isDark && { color: '#FFF', fontWeight: '700' }]}>
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => !isDark && toggleTheme()}
              style={[
                styles.segmentBtn,
                isDark && { backgroundColor: '#C99B36' },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentIcon, isDark && { color: '#000' }]}>🌙</Text>
              <Text style={[styles.segmentText, isDark && { color: '#000', fontWeight: '700' }]}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version Info */}
        <View style={styles.versionFooter}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Nourish Spoon App v1.0.0 • Sargodha, Pakistan
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="More" navigation={navigation} />
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
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  menuBtnText: {
    fontSize: 18,
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  bannerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  bannerHeadline: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'serif',
    marginBottom: 6,
    lineHeight: 24,
  },
  bannerSubtext: {
    fontSize: 12,
    lineHeight: 17,
  },
  bannerImage: {
    width: 100,
    height: 90,
    borderRadius: 14,
  },
  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  listCard: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconSymbol: {
    fontSize: 18,
    color: '#FFF',
  },
  iconSymbolDark: {
    fontSize: 18,
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 12,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  appearanceCard: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  appearanceTextCol: {
    flex: 1,
  },
  segmentedCtrl: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 2,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  segmentIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  segmentText: {
    fontSize: 11,
    color: '#666',
  },
  versionFooter: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 11,
  },
});
