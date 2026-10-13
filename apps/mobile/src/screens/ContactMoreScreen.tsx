import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
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
import { Text, GreenButton } from "../components/DesignPrimitives";
import { useInfoDialog } from "../components/InfoDialog";
import { AppNavigation } from "../navigation/types";
import { Card, Copy } from "../features/commerce/components";
import { useAccountData } from "../features/commerce/useAccountData";
import { watchOrders, watchAddresses } from "../features/commerce/service";

export function ContactMoreScreen({
  navigation,
}: {
  navigation: AppNavigation;
}) {
  const { theme: c, settings, favorites, setThemeMode } = useMobileStore();
  const { showInfo, dialog } = useInfoDialog();
  const [account, setAccount] = useState<User | null>(
    firebaseAuth?.currentUser || null,
  );
  const [phone, setPhone] = useState<string | undefined>();
  const orders = useAccountData(watchOrders),
    addresses = useAccountData(watchAddresses);
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
      title: "Track a TCS Parcel",
      sub: "Track an earlier WhatsApp order",
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
        <Card>
          <View style={s.identity}>
            <View style={[s.avatar, { backgroundColor: c.goldWarm }]}>
              <Text
                style={{ fontFamily: "serif", fontSize: 36, color: c.primary }}
              >
                {(account?.displayName || "Guest").slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.name}>
                {account?.displayName || "Welcome, Guest"}
              </Text>
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
          <GreenButton
            title={account ? "Edit Profile" : "Sign In / Create Account"}
            onPress={() =>
              account
                ? navigation.navigate("EditProfile", {
                    profile: {
                      uid: account.uid,
                      fullName: account.displayName || "",
                      phone,
                    },
                  })
                : navigation.navigate("Login")
            }
          />
        </Card>
        <Card>
          <View style={s.stats}>
            {[
              {
                label: "Orders",
                value: !account
                  ? "—"
                  : orders.error || orders.loading
                    ? "—"
                    : orders.items.length,
                icon: "cube-outline" as const,
                action: () => navigation.navigate("Orders"),
              },
              {
                label: "Wishlist",
                value: favorites.length,
                icon: "heart-outline" as const,
                action: () => navigation.navigate("Wishlist"),
              },
              {
                label: "Addresses",
                value: !account
                  ? "—"
                  : addresses.error || addresses.loading
                    ? "—"
                    : addresses.items.length,
                icon: "location-outline" as const,
                action: () => navigation.navigate("Addresses"),
              },
            ].map((stat) => (
              <TouchableOpacity
                key={stat.label}
                accessibilityRole="button"
                accessibilityLabel={`Open ${stat.label.toLowerCase()}`}
                onPress={stat.action}
                style={s.stat}
              >
                <Ionicons name={stat.icon} size={24} color={c.primary} />
                <Text style={s.name}>{stat.value}</Text>
                <Text style={{ fontSize: 12 }}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        {rows.map((row) => (
          <TouchableOpacity
            key={row.title}
            accessibilityRole="button"
            accessibilityLabel={row.title}
            onPress={row.action}
            style={[
              s.row,
              {
                backgroundColor: c.isDark ? c.surface : "#FFFCF5",
                borderColor: c.border,
              },
            ]}
          >
            <View style={[s.icon, { backgroundColor: c.goldWarm }]}>
              <Ionicons name={row.icon} size={23} color={c.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>{row.title}</Text>
              <Text style={{ fontSize: 12, color: c.textSecondary }}>
                {row.sub}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={17}
              color={c.textSecondary}
            />
          </TouchableOpacity>
        ))}
        <Card>
          <Text style={s.label}>Get in Touch</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              {
                label: "WhatsApp",
                icon: "chatbubble-outline" as const,
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
                style={[s.contact, { borderColor: c.border }]}
              >
                <Ionicons name={item.icon} size={20} color={c.primary} />
                <Text style={{ fontSize: 12 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Copy>
            {settings.business_address}
            {"\n"}
            {settings.business_hours}
          </Copy>
        </Card>
        <Card>
          <Text style={s.label}>Appearance</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["light", "dark"] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                accessibilityRole="button"
                accessibilityLabel={`${mode === "light" ? "Light" : "Dark"} theme`}
                accessibilityState={{ selected: c.mode === mode }}
                onPress={() => setThemeMode(mode)}
                style={[
                  s.contact,
                  {
                    borderColor: c.border,
                    backgroundColor:
                      c.mode === mode ? c.surfaceWarm : c.surface,
                  },
                ]}
              >
                <Ionicons
                  name={mode === "light" ? "sunny-outline" : "moon-outline"}
                  size={20}
                  color={c.primary}
                />
                <Text>{mode === "light" ? "Light" : "Dark"}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        {account && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Sign Out"
            onPress={logout}
            style={[s.row, { borderColor: c.danger }]}
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
  content: { padding: 16, paddingBottom: 20, gap: 10 },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 34,
    lineHeight: 38,
  },
  identity: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 27,
  },
  stats: { flexDirection: "row", gap: 6 },
  stat: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    minHeight: 66,
    borderWidth: 1,
    borderRadius: 14,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 21,
    lineHeight: 24,
  },
  contact: {
    flex: 1,
    minHeight: 48,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
