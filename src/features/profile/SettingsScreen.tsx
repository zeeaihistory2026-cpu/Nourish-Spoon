import {
  Bell,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pencil,
  PhoneCall,
  ShieldCheck,
  User,
} from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../app/navigation/navigationTypes';
import { AppHeader } from '../../components/common/AppHeader';
import { ListRow } from '../../components/common/ListRow';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Toggle } from '../../components/common/Toggle';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { signOutUser } from '../../services/firebase/auth';
import { APP_VERSION, BRAND } from '../../constants';
import { colors, radius, shadows } from '../../theme';
import { openWhatsApp } from '../../utils/whatsapp';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profile = useAuthStore((state) => state.profile);

  const pushEnabled = useSettingsStore((state) => state.pushEnabled);
  const orderUpdates = useSettingsStore((state) => state.orderUpdates);
  const newsletter = useSettingsStore((state) => state.newsletter);
  const setPreference = useSettingsStore((state) => state.setPreference);

  const confirmLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => void signOutUser() },
    ]);
  };

  return (
    <Screen>
      <AppHeader variant="title" title="Settings" onBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listCard}>
          <ListRow
            icon={<User size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Edit Profile"
            chevron
            onPress={() => navigation.navigate('EditProfile')}
          />
          <ListRow
            icon={<Lock size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Change Password"
            chevron
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <ListRow
            icon={<MapPin size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Delivery Locations"
            value={profile?.city || 'Home'}
            chevron
            onPress={() => navigation.navigate('Addresses')}
          />
          <ListRow
            icon={<Package size={19} color={colors.greenMid} strokeWidth={2} />}
            label="My Orders"
            chevron
            onPress={() => navigation.navigate('Orders')}
          />
        </View>

        <SectionHeader title="Preferences" />
        <View style={styles.listCard}>
          <ListRow
            icon={<Bell size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Push Notifications"
            trailing={<Toggle value={pushEnabled} onToggle={() => setPreference('pushEnabled', !pushEnabled)} />}
          />
          <ListRow
            icon={<Package size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Order Updates"
            trailing={<Toggle value={orderUpdates} onToggle={() => setPreference('orderUpdates', !orderUpdates)} />}
          />
          <ListRow
            icon={<Mail size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Newsletter"
            trailing={<Toggle value={newsletter} onToggle={() => setPreference('newsletter', !newsletter)} />}
          />
        </View>

        <SectionHeader title="Support" />
        <View style={styles.listCard}>
          <ListRow
            icon={<HelpCircle size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Help & FAQ"
            chevron
            onPress={() => void openWhatsApp(`Hi ${BRAND.name}! I have a question.`)}
          />
          <ListRow
            icon={<PhoneCall size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Contact Us"
            chevron
            onPress={() => void openWhatsApp(`Hi ${BRAND.name}! I would like to get in touch.`)}
          />
          <ListRow
            icon={<ShieldCheck size={19} color={colors.greenMid} strokeWidth={2} />}
            label="Privacy Policy"
            chevron
            onPress={() => void openWhatsApp(`Hi ${BRAND.name}! Please share your Privacy Policy.`)}
          />
        </View>

        <View style={styles.listCard}>
          <ListRow
            icon={<LogOut size={19} color={colors.danger} strokeWidth={2} />}
            label="Log Out"
            danger
            onPress={confirmLogout}
          />
        </View>

        <AppText variant="small" color="textLight" style={styles.version}>
          {BRAND.name} v{APP_VERSION} · {BRAND.tagline}
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 34,
  },
  listCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  version: {
    marginTop: 18,
    textAlign: 'center',
  },
});
