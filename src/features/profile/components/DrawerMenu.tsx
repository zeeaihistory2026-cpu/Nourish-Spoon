import { ChevronRight, Cog, Heart, HelpCircle, Home, LogOut, MapPin, Package, PhoneCall, User, Bell, type LucideIcon } from 'lucide-react-native';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '../../../components/ui/Avatar';
import { AppText } from '../../../components/ui/AppText';
import { Divider } from '../../../components/ui/Divider';
import { useAuthStore } from '../../../store/authStore';
import { APP_VERSION, BRAND } from '../../../constants';
import { DEMO_MODE } from '../../../demo/demo';
import { signOutUser } from '../../../services/firebase/auth';
import { colors, shadows } from '../../../theme';
import type { RootStackParamList } from '../../../app/navigation/navigationTypes';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { openWhatsApp } from '../../../utils/whatsapp';

interface DrawerItem {
  label: string;
  icon: LucideIcon;
  route?: keyof RootStackParamList;
  active?: boolean;
}

const SECTIONS: { title: string; items: DrawerItem[] }[] = [
  {
    title: 'Menu',
    items: [
      { label: 'Home', icon: Home, active: true },
      { label: 'My Orders', icon: Package, route: 'Orders' },
      { label: 'Wishlist', icon: Heart, route: 'Wishlist' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'User Profile', icon: User, route: 'EditProfile' },
      { label: 'Delivery Location', icon: MapPin, route: 'Addresses' },
      { label: 'Settings', icon: Cog, route: 'Settings' },
      { label: 'Notifications', icon: Bell, route: 'Notifications' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & FAQ', icon: HelpCircle },
      { label: 'Contact Us', icon: PhoneCall },
    ],
  },
];

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profile = useAuthStore((state) => state.profile);
  const insets = useSafeAreaInsets();

  const displayName = profile?.fullName ?? 'Guest';
  const email = profile?.email ?? '';

  const handleItem = (item: DrawerItem) => {
    onClose();
    if (item.label === 'Help & FAQ') {
      void openWhatsApp('Hi Nourish Spoon! I have a question.');
      return;
    }
    if (item.label === 'Contact Us') {
      void openWhatsApp('Hi Nourish Spoon! I would like to get in touch.');
      return;
    }
    if (item.route) {
      // Item routes come from a fixed config, so the dynamic name is safe here.
      navigation.navigate(item.route as never);
    }
  };

  const confirmLogout = () => {
    if (DEMO_MODE) {
      Alert.alert(
        'Demo mode',
        'Accounts are disabled while the app runs without a backend. Your cart and orders are saved on this phone.'
      );
      return;
    }
    onClose();
    Alert.alert('Log Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          void signOutUser();
        },
      },
    ]);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu" />
        <View style={[styles.drawer, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.profile}>
            <Avatar name={displayName} size="md" />
            <View style={styles.profileMeta}>
              <AppText variant="cardTitle" color="text" numberOfLines={1}>
                {displayName}
              </AppText>
              <AppText variant="smallLight" color="textLight" numberOfLines={1}>
                {email}
              </AppText>
            </View>
          </View>

          <View style={styles.menu}>
            {SECTIONS.map((section, sectionIndex) => (
              <View key={section.title}>
                {sectionIndex > 0 ? <Divider style={styles.sectionDivider} /> : null}
                <AppText variant="label" color="textLight" style={styles.sectionTitle}>
                  {section.title}
                </AppText>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Pressable
                      key={item.label}
                      onPress={() => handleItem(item)}
                      style={({ pressed }) => [
                        styles.item,
                        item.active && styles.itemActive,
                        pressed && { opacity: 0.7 },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={item.label}
                    >
                      <Icon size={19} color={item.active ? colors.greenDark : colors.greenMid} strokeWidth={2} />
                      <AppText
                        variant="body"
                        style={[styles.itemLabel, item.active && { color: colors.greenDark, fontWeight: '500' }]}
                      >
                        {item.label}
                      </AppText>
                      <View style={styles.chev}>
                        <ChevronRight size={15} color={colors.chevron} strokeWidth={2} />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            <Pressable
              onPress={confirmLogout}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              <LogOut size={19} color={colors.danger} strokeWidth={2} />
              <AppText variant="body" style={[styles.itemLabel, { color: colors.danger }]}>
                Log Out
              </AppText>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <AppText variant="smallLight" color="textLight">
              v{APP_VERSION}
            </AppText>
            <AppText variant="smallLight" color="textLight">
              {BRAND.tagline}
            </AppText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.scrim,
  },
  drawer: {
    width: 292,
    height: '100%',
    backgroundColor: colors.cream,
    borderTopRightRadius: 26,
    borderBottomRightRadius: 26,
    ...shadows.lg,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  profileMeta: {
    flexShrink: 1,
  },
  menu: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  sectionDivider: {
    marginVertical: 10,
  },
  sectionTitle: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 13,
  },
  itemActive: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  itemLabel: {
    fontSize: 14,
    lineHeight: 19,
  },
  chev: {
    marginLeft: 'auto',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
});
