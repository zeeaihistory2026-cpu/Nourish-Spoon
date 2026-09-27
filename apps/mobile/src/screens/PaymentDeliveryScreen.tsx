import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useMobileStore } from '../services/storeService';
import { ASSETS } from '../constants/assets';

interface PaymentDeliveryScreenProps {
  onBack: () => void;
}

export const PaymentDeliveryScreen: React.FC<PaymentDeliveryScreenProps> = ({ onBack }) => {
  const { theme, paymentMethods, deliveryMethods } = useMobileStore();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const handlePaymentClick = (pm: any) => {
    Alert.alert(
      pm.name,
      `Account Title: ${pm.account_title}\nAccount #: ${pm.account_number}\n${pm.bank_name ? `Bank: ${pm.bank_name}\n` : ''}\n${pm.instructions}`
    );
  };

  const handleDeliveryClick = (dm: any) => {
    Alert.alert(
      dm.title,
      `${dm.description}\n\nEstimated Time: ${dm.estimated_time}\nFee: ${dm.fee === 0 ? 'Free' : `Rs. ${dm.fee}`}`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        showBack
        onBack={onBack}
        rightAction="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text style={[styles.heading, { color: theme.primaryDark }]}>
            Payment & Delivery
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Secure and convenient options for your orders.
          </Text>
        </View>

        {/* Section 1: Payment Method */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Payment Method
            </Text>
            <Text style={[styles.sectionSublabel, { color: theme.textSecondary }]}>
              (Advance Payment Only)
            </Text>
          </View>

          <View style={styles.listContainer}>
            {paymentMethods.filter(p => p.active).map(pm => {
              const iconSource =
                pm.code === 'bank_transfer' ? ASSETS.iconBank :
                pm.code === 'easypaisa' ? ASSETS.iconEasyPaisa :
                ASSETS.iconJazzCash;

              return (
                <TouchableOpacity
                  key={pm.id}
                  onPress={() => handlePaymentClick(pm)}
                  style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  activeOpacity={0.8}
                >
                  <Image source={iconSource} style={styles.itemIcon} resizeMode="contain" />
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>
                      {pm.name}
                    </Text>
                    <Text style={[styles.itemSubtext, { color: theme.textSecondary }]}>
                      {pm.subtext}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Yellow Warning / Info Banner */}
          <View style={[styles.noticeBanner, { backgroundColor: theme.goldWarm, borderColor: theme.goldLight }]}>
            <Ionicons name="information-circle" size={20} color={theme.gold} style={{ marginRight: 8, marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.noticeHeading, { color: theme.mode === 'light' ? '#7A5B0B' : '#F1D79E' }]}>
                We do not offer Cash on Delivery.
              </Text>
              <Text style={[styles.noticeText, { color: theme.mode === 'light' ? '#8C6C16' : '#E0C58A' }]}>
                Orders are confirmed after advance payment.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Delivery Options */}
        <View style={[styles.sectionBox, { marginTop: 22 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Delivery Options
            </Text>
            <Text style={[styles.sectionSublabel, { color: theme.textSecondary }]}>
              Choose a delivery method that works best for you.
            </Text>
          </View>

          <View style={styles.listContainer}>
            {deliveryMethods.filter(d => d.active).map(dm => {
              const iconSource =
                dm.code === 'sargodha_sameday' ? ASSETS.iconDeliverySargodha :
                dm.code === 'tcs_nationwide' ? ASSETS.iconDeliveryTcs :
                dm.code === 'foodpanda_sargodha' ? ASSETS.iconDeliveryFoodpanda :
                ASSETS.iconDeliveryPickup;

              return (
                <TouchableOpacity
                  key={dm.id}
                  onPress={() => handleDeliveryClick(dm)}
                  style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  activeOpacity={0.8}
                >
                  <Image source={iconSource} style={styles.itemIcon} resizeMode="contain" />
                  <View style={styles.itemDetails}>
                    <Text style={[styles.itemTitle, { color: theme.text }]}>
                      {dm.title}
                    </Text>
                    <Text style={[styles.itemSubtext, { color: theme.textSecondary }]}>
                      {dm.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  heading: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionBox: {},
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSublabel: {
    fontSize: 11.5,
    marginTop: 2,
  },
  listContainer: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  itemSubtext: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  noticeHeading: {
    fontSize: 12,
    fontWeight: '700',
  },
  noticeText: {
    fontSize: 11,
    marginTop: 2,
  },
});
