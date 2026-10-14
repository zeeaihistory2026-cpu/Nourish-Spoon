import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Linking } from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import {
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { firebaseAuth, db } from "../services/firebase";
import { useMobileStore } from "../services/storeService";
import { Header } from "../components/Header";
import { Text } from "../components/DesignPrimitives";
import { useInfoDialog } from "../components/InfoDialog";
import { AppNavigation } from "../navigation/types";
import { Copy } from "../features/commerce/components";

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
  }[] = [
    {
      title: "My Orders",
      sub: "Track, manage and reorder",
      icon: "receipt-outline",
      action: () => navigation.navigate("Orders"),
    },
    {
      title: "My Points",
      sub: "Your rewards and points history",
      icon: "gift-outline",
      action: () => navigation.navigate("Rewards"),
    },
    {
      title: "Refer & Earn",
      sub: "Invite friends and earn 200 points",
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
      title: "Notifications",
      sub: "Order and payment updates",
      icon: "notifications-outline",
      action: () => navigation.navigate("Notifications"),
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
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {dialog}
      <Header
        onMenu={navigation.openMenu}
        rightAction="cart"
        onCart={() => navigation.navigate("Cart")}
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={s.heading}>
          My Profile
        </Text>
        <Copy>Manage your account and preferences.</Copy>
        <View
          style={[
            s.card,
            {
              backgroundColor: c.surface,
              borderColor: c.isDark ? c.border : "#EFE3C2",
            },
          ]}
        >
          <View style={s.identity}>
            <View style={[s.avatar, { backgroundColor: "#C9A84C" }]}>
              <Text
                style={{ fontFamily: "serif", fontSize: 36, color: "#FFFFFF" }}
              >
                {(account?.displayName || "Guest").slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                {account && (
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
                    style={{
                      width: 44,
                      height: 44,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: -10,
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={c.primary}
                    />
                  </TouchableOpacity>
                )}
                <Text style={[s.name, { flex: 1 }]}>
                  {account?.displayName || "Welcome, Guest"}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: c.textSecondary }}>
                {account?.email || "Sign in for a personal experience"}
              </Text>
              {account && (
                <Copy>
                  {phone ?? "Loading number…"}
                  {phone === "" ? " " : ""}
                </Copy>
              )}
            </View>
          </View>
          {!account && (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Sign In"
                  onPress={() => navigation.navigate("Login")}
                  style={[
                    s.profileButton,
                    { borderColor: "#C9A84C", backgroundColor: "#FFFFFF" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#A6862A",
                      fontWeight: "500",
                    }}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Create Account"
                  onPress={() => navigation.navigate("Signup")}
                  style={[
                    s.profileButton,
                    { backgroundColor: "#1B4332", borderColor: "#1B4332" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#FFFFFF",
                      fontWeight: "500",
                    }}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              </>
            </View>
          )}
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
          {rows.map((row, index) => (
            <TouchableOpacity
              key={row.title}
              accessibilityRole="button"
              accessibilityLabel={row.title}
              accessibilityHint={row.sub}
              onPress={row.action}
              style={[
                s.row,
                {
                  borderBottomWidth: index < rows.length - 1 ? 1 : 0,
                  borderColor: c.isDark ? c.border : "#F3ECD8",
                },
              ]}
            >
              <Ionicons name={row.icon} size={22} color={c.primary} />
              <Text style={s.label}>{row.title}</Text>
              <Ionicons name="chevron-forward" size={17} color="#C9BFA4" />
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[
            s.group,
            {
              backgroundColor: c.surface,
              borderColor: c.isDark ? c.border : "#EFE3C2",
            },
          ]}
        >
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
              url: `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`,
            },
            {
              label: "Call",
              icon: "call-outline" as const,
              url: `tel:${settings.whatsapp_number}`,
            },
            {
              label: "Email",
              icon: "mail-outline" as const,
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
                minHeight: 54,
                gap: 4,
                borderRadius: 14,
                backgroundColor: c.surface,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <Ionicons name={item.icon} size={22} color={c.primary} />
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
                borderColor: c.isDark ? c.border : "#EFE3C2",
                backgroundColor: c.surface,
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
  content: { padding: 18, paddingBottom: 20, gap: 10 },
  profileButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 24,
  },
  card: { padding: 16, gap: 12, borderRadius: 18, borderWidth: 1 },
  group: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  section: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 23,
    marginTop: 4,
  },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 34,
    lineHeight: 38,
  },
  identity: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 21,
    lineHeight: 25,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  label: { flex: 1, fontSize: 15, lineHeight: 21 },
});
