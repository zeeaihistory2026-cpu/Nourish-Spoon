import {
  ChevronRight,
  Clock,
  Info,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useState, type ReactNode, type ReactElement } from 'react';

import { AppHeader } from '../../components/common/AppHeader';
import { DecorativeLeaves } from '../../components/common/DecorativeLeaves';
import { DrawerMenu } from './components/DrawerMenu';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { WhatsAppIcon } from '../../components/ui/BrandIcons';
import { BRAND, SUPPORT } from '../../constants';
import { FONT_FAMILY, colors, radius, shadows } from '../../theme';
import { openWhatsApp } from '../../utils/whatsapp';

const INSTAGRAM_URL = 'https://instagram.com/nourishspoon';
const MAPS_URL = 'https://maps.google.com/?q=Sargodha,+Punjab,+Pakistan';

interface ContactRow {
  key: string;
  icon: ReactElement;
  iconBg?: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function ContactMoreScreen({ navigation }: { navigation: { navigate: (name: string, params?: object) => void } }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const contactRows: ContactRow[] = [
    {
      key: 'whatsapp',
      icon: <WhatsAppIcon size={22} />,
      iconBg: colors.whatsapp,
      title: 'Chat on WhatsApp',
      subtitle: '+92 304 6721962',
      onPress: () => void openWhatsApp(`Hi ${BRAND.name}! I have a question.`),
    },
    {
      key: 'call',
      icon: <Phone size={21} color={colors.greenDark} strokeWidth={1.9} />,
      title: 'Call Us',
      subtitle: '+92 304 6721962',
      onPress: () => void Linking.openURL('tel:+923046721962').catch(() => undefined),
    },
    {
      key: 'email',
      icon: <Mail size={21} color={colors.greenDark} strokeWidth={1.9} />,
      title: 'Email Us',
      subtitle: SUPPORT.email,
      onPress: () => void Linking.openURL(`mailto:${SUPPORT.email}`).catch(() => undefined),
    },
    {
      key: 'location',
      icon: <MapPin size={21} color={colors.white} strokeWidth={1.9} />,
      iconBg: colors.greenDark,
      title: 'Our Location',
      subtitle: 'Sargodha, Punjab, Pakistan',
      onPress: () => void Linking.openURL(MAPS_URL).catch(() => undefined),
    },
    {
      key: 'hours',
      icon: <Clock size={21} color={colors.greenDark} strokeWidth={1.9} />,
      title: 'Business Hours',
      subtitle: 'Monday â€“ Saturday, 8am â€“ 11pm',
    },
    {
      key: 'instagram',
      icon: (
        <View style={styles.instaBadge}>
          <AppText style={{ fontSize: 17 }}>ðŸ“¸</AppText>
        </View>
      ),
      title: 'Follow on Instagram',
      subtitle: '@nourishspoon',
      onPress: () => void Linking.openURL(INSTAGRAM_URL).catch(() => undefined),
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader variant="title" title="Contact & More" onMenu={() => setDrawerOpen(true)} leaves />

        <View style={styles.hero}>
          <Image
            source={BRAND.energyBallsImage}
            style={styles.heroImage}
            contentFit="cover"
            transition={250}
          />
          <View style={styles.heroScrim} />
          <View style={styles.heroText}>
            <AppText style={styles.heroTitle}>
              We'd love to{'\n'}hear from you.
            </AppText>
            <AppText variant="small" color="text" style={styles.heroBody}>
              For orders, inquiries or bulk/gift orders, feel free to contact us. Our team is
              always here to help!
            </AppText>
          </View>
        </View>

        <AppText style={styles.sectionTitle}>Get in Touch</AppText>
        <View style={styles.card}>
          {contactRows.map((row, index) => (
            <Pressable
              key={row.key}
              onPress={row.onPress}
              disabled={!row.onPress}
              accessibilityRole={row.onPress ? 'button' : undefined}
              style={({ pressed }) => [
                styles.row,
                index > 0 && styles.rowBorder,
                pressed && { opacity: 0.75 },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: row.iconBg ?? colors.goldBg }]}>
                {row.icon}
              </View>
              <View style={styles.rowBody}>
                <AppText variant="bodySemibold" color="greenDark">
                  {row.title}
                </AppText>
                <AppText variant="small" color="textMid">
                  {row.subtitle}
                </AppText>
              </View>
              {row.onPress ? (
                <ChevronRight size={18} color={colors.textLight} strokeWidth={2} />
              ) : null}
            </Pressable>
          ))}
        </View>

        <AppText style={styles.sectionTitle}>More</AppText>
        <View style={styles.card}>
          <MoreRow
            icon={<AppText style={{ fontSize: 16 }}>â“</AppText>}
            title="FAQ"
            subtitle="Get answers to common questions"
            onPress={() => navigation.navigate('Faq')}
          />
          <MoreRow
            icon={<Info size={20} color={colors.greenDark} strokeWidth={1.9} />}
            title="About Nourish Spoon"
            subtitle="Our story, values and what makes us special"
            onPress={() => navigation.navigate('About')}
          />
          <MoreRow
            icon={<MessageCircleFallback />}
            title="Order on WhatsApp"
            subtitle="Quick and easy ordering"
            onPress={() => void openWhatsApp(`Hi ${BRAND.name}! I would like to place an order.`)}
          />
        </View>

        <AppText style={styles.sectionTitle}>Appearance</AppText>
        <View style={styles.card}>
          <View style={styles.appearanceRow}>
            <View style={[styles.rowIcon, { backgroundColor: colors.goldBg }]}>
              <AppText style={{ fontSize: 16 }}>â˜€ï¸</AppText>
            </View>
            <View style={styles.rowBody}>
              <AppText variant="bodySemibold" color="greenDark">
                Appearance
              </AppText>
              <AppText variant="small" color="textMid">
                Choose your preferred app theme.
              </AppText>
            </View>
            <View style={styles.themePill}>
              <Pressable
                onPress={() => setTheme('light')}
                accessibilityRole="button"
                accessibilityState={{ selected: theme === 'light' }}
                style={[styles.themeOption, theme === 'light' && styles.themeOptionOn]}
              >
                <AppText variant="micro" style={{ color: theme === 'light' ? colors.white : colors.textMid }}>
                  â˜€ Light
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => setTheme('dark')}
                accessibilityRole="button"
                accessibilityState={{ selected: theme === 'dark' }}
                style={[styles.themeOption, theme === 'dark' && styles.themeOptionOn]}
              >
                <AppText variant="micro" style={{ color: theme === 'dark' ? colors.white : colors.textMid }}>
                  â˜¾ Dark
                </AppText>
              </Pressable>
            </View>
          </View>
          {theme === 'dark' ? (
            <AppText variant="microRegular" color="textMid" style={styles.darkNote}>
              Dark theme is coming in the next release â€” your choice is saved.
            </AppText>
          ) : null}
        </View>
      </ScrollView>

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Screen>
  );
}

function MessageCircleFallback() {
  return <AppText style={{ fontSize: 17 }}>ðŸ’¬</AppText>;
}

function MoreRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={({ pressed }) => [styles.row, styles.rowBorder, pressed && { opacity: 0.75 }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.goldBg }]}>{icon}</View>
      <View style={styles.rowBody}>
        <AppText variant="bodySemibold" color="greenDark">
          {title}
        </AppText>
        <AppText variant="small" color="textMid">
          {subtitle}
        </AppText>
      </View>
      {onPress ? <ChevronRight size={18} color={colors.textLight} strokeWidth={2} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  hero: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: 168,
    backgroundColor: colors.imageBg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(253, 246, 227, 0.86)',
  },
  instaBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D6329B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 27,
    lineHeight: 33,
    color: colors.greenDark,
  },
  heroBody: {
    marginTop: 7,
    maxWidth: 300,
    lineHeight: 19,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.display.semibold,
    fontSize: 21,
    lineHeight: 26,
    color: colors.text,
    marginTop: 18,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderRow,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  appearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  themePill: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  themeOptionOn: {
    backgroundColor: colors.greenDark,
  },
  darkNote: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
});
