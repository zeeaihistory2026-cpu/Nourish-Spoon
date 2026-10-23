import { BUTTON_COLORS, BUTTON_OUTLINE } from "../constants/theme";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { unregisterPushNotifications } from "../services/pushNotifications";
import { firebaseAuth, db } from "../services/firebase";
import { useMobileStore } from "../services/storeService";
import { Header } from "../components/Header";
import { Text } from "../components/DesignPrimitives";
import { useInfoDialog } from "../components/InfoDialog";
import { AppNavigation } from "../navigation/types";
import { commerceEnabled } from "../features/commerce/availability";
import { choosePhoto, useRemotePhoto } from "../services/photos";
import { call, commerceError } from "../features/commerce/service";

export function ContactMoreScreen({
  navigation,
}: {
  navigation: AppNavigation;
}) {
  const { theme: c, settings, setThemeMode } = useMobileStore();
  const { showInfo, dialog } = useInfoDialog();
  const [account, setAccount] = useState<User | null>(
    firebaseAuth?.currentUser || null,
  );
  const [phone, setPhone] = useState<string | undefined>();
  const [photoBusy, setPhotoBusy] = useState(false);
  const photo = useRemotePhoto(
    account ? `users/${account.uid}/media/profile` : undefined,
  );
  async function changePhoto() {
    if (!account || photoBusy) return;
    setPhotoBusy(true);
    try {
      const image = await choosePhoto(true);
      if (image) await call("saveProfilePhoto", { photo: image });
    } catch (error) {
      showInfo("Unable to save photo", commerceError(error));
    } finally {
      setPhotoBusy(false);
    }
  }
  useEffect(
    () =>
      firebaseAuth ? onAuthStateChanged(firebaseAuth, setAccount) : undefined,
    [],
  );
  useEffect(() => {
    setPhone(undefined);
    if (account && db)
      return onSnapshot(
        doc(db, "users", account.uid),
        (snapshot) => setPhone(snapshot.data()?.phone || ""),
        () => {},
      );
  }, [account?.uid]);
  async function open(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      showInfo(
        "Unable to open link",
        "Please contact us at " + settings.whatsapp_number,
      );
    }
  }
  async function logout() {
    try {
      await unregisterPushNotifications();
      await signOut(firebaseAuth!);
    } catch {
      showInfo("Unable to sign out", "Please try again.");
    }
  }
  const rows: {
    title: string;
    sub: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    action: () => void;
    requiresCommerce?: boolean;
  }[] = [
    {
      title: "My Points",
      requiresCommerce: true,
      sub: "Your rewards and points history",
      icon: "gift-outline",
      action: () => navigation.navigate("Rewards"),
    },
    {
      title: "Refer & Earn",
      requiresCommerce: true,
      sub: "Invite friends and earn points",
      icon: "people-outline",
      action: () => navigation.navigate("Referrals"),
    },
    {
      title: "My Wishlist",
      sub: "Your favourite products",
      icon: "heart-outline",
      action: () => navigation.navigate("Wishlist"),
    },
    {
      title: "Saved Addresses",
      sub: "Manage your delivery addresses",
      icon: "location-outline",
      action: () => navigation.navigate("Addresses"),
    },
    {
      title: "Track Order",
      sub: "Order progress and TCS tracking",
      icon: "car-outline",
      action: () => navigation.navigate("TrackOrder"),
    },
    {
      title: "Reviews",
      sub: "Read customer reviews and review delivered orders",
      icon: "star-outline",
      action: () => navigation.navigate("Reviews"),
    },
    {
      title: "Help & Support",
      sub: "Answers to common questions",
      icon: "help-circle-outline",
      action: () => navigation.navigate("FAQ"),
    },
  ];
  if (account && !account.emailVerified)
    rows.push({
      title: "Verify Email",
      sub: "Confirm ownership of your account",
      icon: "mail-outline",
      action: async () => {
        try {
          await sendEmailVerification(account);
          showInfo(
            "Verification sent",
            "Check your inbox to verify your email.",
          );
        } catch {
          showInfo("Unable to send email", "Please wait and try again.");
        }
      },
    });
  const quickTitles = [
    "Track Order",
    "My Points",
    "My Wishlist",
    "Saved Addresses",
  ];
  const visibleRows = rows.filter(
    (row) => !row.requiresCommerce || commerceEnabled,
  );
  const quickRows = quickTitles.flatMap((title) =>
    visibleRows.filter((row) => row.title === title),
  );
  const menuRows = visibleRows.filter(
    (row) => !quickTitles.includes(row.title),
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {dialog}
      <Header
        onMenu={navigation.openMenu}
        rightAction="notifications"
        onNotifications={() => navigation.navigate("Notifications")}
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ position: "relative", paddingTop: 6, paddingBottom: 8 }}>
          <Image
            source={require("../../assets/design/botanical.png")}
            resizeMode="contain"
            style={{
              position: "absolute",
              right: -48,
              top: -8,
              width: 160,
              height: 180,
              opacity: c.isDark ? 0.12 : 0.24,
            }}
          />
          <Text accessibilityRole="header" style={s.heading}>
            My Profile
          </Text>
        </View>
        {account && (
          <View
            style={[
              s.card,
              {
                backgroundColor: BUTTON_COLORS.background,
                borderColor: BUTTON_COLORS.border,
              },
            ]}
          >
            <View style={s.identity}>
              <TouchableOpacity
                onPress={changePhoto}
                disabled={photoBusy}
                accessibilityRole="button"
                accessibilityLabel="Change profile photo"
                style={s.avatarButton}
              >
                <View
                  style={[
                    s.avatar,
                    {
                      backgroundColor: "#C9A84C",
                      borderColor: "#EAD6A0",
                      borderWidth: 2,
                    },
                  ]}
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      resizeMode="cover"
                      style={s.avatarPhoto}
                    />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "serif",
                        fontSize: 32,
                        color: "#FFFFFF",
                      }}
                    >
                      {(account.displayName || account.email || "N")
                        .slice(0, 1)
                        .toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={s.cameraBadge}>
                  {photoBusy ? (
                    <ActivityIndicator
                      size="small"
                      color={BUTTON_COLORS.background}
                    />
                  ) : (
                    <Ionicons
                      name="camera"
                      size={12}
                      color={BUTTON_COLORS.background}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Text style={[s.name, { color: "#FFFFFF" }]}>
                  {account.displayName || "My account"}
                </Text>
                <Text
                  style={{ color: "#E4EFE9", fontSize: 12, lineHeight: 17 }}
                >
                  {account.email}
                </Text>
                {!!phone && (
                  <Text
                    style={{ color: "#E4EFE9", fontSize: 12, lineHeight: 17 }}
                  >
                    {phone}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Edit Profile"
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    profile: {
                      uid: account.uid,
                      fullName: account.displayName || "",
                      phone,
                    },
                  })
                }
                style={[
                  s.editButton,
                  BUTTON_OUTLINE,
                  { backgroundColor: BUTTON_COLORS.background },
                ]}
              >
                <Ionicons name="pencil-outline" size={19} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={s.quickGrid}>
          {quickRows.map((row) => (
            <TouchableOpacity
              key={row.title}
              accessibilityRole="button"
              accessibilityLabel={row.title}
              accessibilityHint={row.sub}
              onPress={row.action}
              style={[
                s.quickCard,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <View
                style={[
                  s.quickIcon,
                  {
                    backgroundColor: c.isDark
                      ? c.surfaceWarm
                      : row.title === "My Wishlist"
                        ? "#FFF0F0"
                        : row.title === "My Points"
                          ? "#FFF5DC"
                          : "#EDF6E9",
                  },
                ]}
              >
                <Ionicons
                  name={row.icon}
                  size={23}
                  color={
                    row.title === "My Wishlist"
                      ? "#E13C42"
                      : row.title === "My Points"
                        ? "#A46C0B"
                        : c.primary
                  }
                />
              </View>
              <Text style={s.quickLabel}>{row.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[
            s.group,
            {
              backgroundColor: c.isDark ? c.surface : "#FFFFFF",
              borderColor: c.isDark ? c.border : "#EFE3C2",
            },
          ]}
        >
          {menuRows.map((row, index) => (
            <TouchableOpacity
              key={row.title}
              accessibilityRole="button"
              accessibilityLabel={row.title}
              accessibilityHint={row.sub}
              onPress={row.action}
              style={[
                s.row,
                {
                  borderBottomWidth: 1,
                  borderColor: c.isDark ? c.border : "#F3ECD8",
                },
              ]}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: c.isDark
                    ? c.surfaceWarm
                    : row.title === "My Wishlist"
                      ? "#FFF0F0"
                      : index % 3 === 1
                        ? "#FFF5DC"
                        : "#EDF6E9",
                }}
              >
                <Ionicons
                  name={row.icon}
                  size={24}
                  color={
                    row.title === "My Wishlist"
                      ? "#E13C42"
                      : index % 3 === 1
                        ? "#A46C0B"
                        : c.primary
                  }
                />
              </View>
              <Text style={s.label}>{row.title}</Text>
              <Ionicons name="chevron-forward" size={17} color="#C9BFA4" />
            </TouchableOpacity>
          ))}
          <View style={s.row}>
            <Ionicons name="moon-outline" size={22} color={c.primary} />
            <Text style={s.label}>Dark Mode</Text>
            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityLabel="Dark mode"
              aria-checked={c.isDark}
              accessibilityState={{ checked: c.isDark }}
              onPress={() => setThemeMode(c.isDark ? "light" : "dark")}
              style={{ width: 48, height: 44, justifyContent: "center" }}
            >
              <View
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: c.isDark ? "#1B4332" : "#E2D8BC",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 3,
                    left: c.isDark ? 23 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: "#FFFFFF",
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            paddingVertical: 4,
          }}
        >
          {[
            {
              label: "WhatsApp",
              icon: "logo-whatsapp" as const,
              color: "#25D366",
              url: `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`,
            },
            {
              label: "Call",
              icon: "call-outline" as const,
              color: c.isDark ? "#60A5FA" : "#2563EB",
              url: `tel:${settings.whatsapp_number}`,
            },
            {
              label: "Email",
              icon: "mail-outline" as const,
              color: c.isDark ? "#FF7A70" : "#EA4335",
              url: `mailto:${settings.contact_email}`,
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => open(item.url)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 52,
                gap: 4,
                borderRadius: 14,
                backgroundColor: c.surface,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
              <Text style={{ fontSize: 12 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {account && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Sign Out"
            onPress={logout}
            style={[
              s.row,
              s.group,
              {
                borderWidth: 0,
                justifyContent: "center",
                backgroundColor: "transparent",
                paddingVertical: 8,
                minHeight: 44,
              },
            ]}
          >
            <Ionicons name="log-out-outline" size={24} color={c.danger} />
            <Text style={{ color: c.danger, fontSize: 16 }}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4, gap: 10 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickCard: {
    flexBasis: "46%",
    flexGrow: 1,
    minWidth: 0,
    minHeight: 74,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: { flex: 1, fontSize: 14, lineHeight: 19, fontWeight: "600" },
  avatarButton: { width: 56, height: 56 },
  avatarPhoto: { width: "100%", height: "100%", borderRadius: 28 },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#FFFDF7",
    borderWidth: 1,
    borderColor: "#D7B56D",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    borderRadius: 22,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  card: { padding: 16, gap: 12, borderRadius: 18, borderWidth: 1 },
  group: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 32,
    lineHeight: 36,
  },
  identity: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 21,
    lineHeight: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  label: { flex: 1, fontSize: 15, lineHeight: 21 },
});
