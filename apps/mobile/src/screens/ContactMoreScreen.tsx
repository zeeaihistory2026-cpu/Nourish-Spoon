import { useInfoDialog } from "../components/InfoDialog";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "../components/Header";
import { Text, ART } from "../components/DesignPrimitives";
import { useStore } from "../services/storeService";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { firebaseAuth } from "../services/firebase";

export function ContactMoreScreen({ navigation }: { navigation: any }) {
  const { showInfo, dialog } = useInfoDialog();
  const { currentTheme: c, settings, setThemeMode } = useStore();
  const open = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      showInfo(
        "Unable to open link",
        "Please contact us at " + settings.whatsapp_number,
      );
    }
  };
  const [account, setAccount] = useState<User | null>(firebaseAuth?.currentUser || null);
  useEffect(() => firebaseAuth ? onAuthStateChanged(firebaseAuth, setAccount) : undefined, []);
  const accountAction = async () => {
    if (!account) { navigation.navigate("Login"); return; }
    try { await signOut(firebaseAuth!); showInfo("Signed out", "You can continue browsing and ordering as a guest."); }
    catch { showInfo("Unable to sign out", "Please try again."); }
  };
  const phone = settings.whatsapp_number.replace(/\D/g, "");
  const rows = [
    {
      title: "Chat on WhatsApp",
      sub: settings.whatsapp_number,
      icon: "whatsapp",
      bg: "#209E3F",
      action: () => open(`https://wa.me/${phone}`),
    },
    {
      title: "Call Us",
      sub: settings.whatsapp_number,
      icon: "phone",
      action: () => open(`tel:${settings.whatsapp_number}`),
    },
    {
      title: "Email Us",
      sub: settings.contact_email,
      icon: "envelope-o",
      action: () => open(`mailto:${settings.contact_email}`),
    },
    {
      title: "Our Location",
      sub: settings.business_address,
      icon: "map-marker",
      bg: "#315C33",
      action: () => open("https://maps.google.com/?q=Sargodha,Punjab,Pakistan"),
    },
    {
      title: "Business Hours",
      sub: settings.business_hours,
      icon: "clock-o",
      action: () => showInfo("Business Hours", settings.business_hours),
    },
    {
      title: "Follow on Instagram",
      sub: "@nourishspoon",
      icon: "instagram",
      bg: "#CF1680",
      action: () => open("https://instagram.com/nourishspoon"),
    },
  ];
  const more = [
    {
      title: "FAQ",
      sub: "Get answers to common questions",
      icon: "question-circle-o",
      action: () => navigation.navigate("FAQ"),
    },
    {
      title: "About Nourish Spoon",
      sub: "Our story, values and what makes us special",
      icon: "info-circle",
      action: () => navigation.navigate("About"),
    },
    {
      title: "Order on WhatsApp",
      sub: "Quick and easy ordering",
      icon: "whatsapp",
      action: () => navigation.navigate("WhatsAppOrder"),
    },
    {
      title: "Payment & Delivery",
      sub: "Payment options and delivery information",
      icon: "truck",
      action: () => navigation.navigate("PaymentDelivery"),
    },
    {
      title: account ? "Sign Out" : "My Account",
      sub: account ? `${account.displayName || "Your account"} · ${account.email || ""}` : "Sign in or create your account",
      icon: "user-o",
      action: accountAction,
    },
  ];
  const list = (items: typeof more) => (
    <View
      style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}
    >
      {items.map((r, i) => (
        <TouchableOpacity
          key={r.title}
          accessibilityRole="button"
          accessibilityLabel={r.title}
          onPress={r.action}
          style={[
            s.row,
            i > 0 && { borderTopWidth: 1, borderTopColor: c.border },
          ]}
        >
          <View
            style={[
              s.icon,
              { backgroundColor: "bg" in r ? (r.bg as string) : c.goldWarm },
            ]}
          >
            <FontAwesome
              name={r.icon as any}
              size={25}
              color={"bg" in r ? "#fff" : c.primary}
            />
          </View>
          <View style={s.copy}>
            <Text style={[s.label, { color: c.text }]}>{r.title}</Text>
            <Text style={[s.sub, { color: c.textSecondary }]}>{r.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color={c.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {dialog}
      <Header
        title="Contact & More"
        onMenu={() => navigation.navigate("Home")}
        rightAction="none"
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.hero, { backgroundColor: c.surfaceWarm }]}>
          <Image source={ART.contact} style={s.heroImage} resizeMode="cover" />
          <LinearGradient
            pointerEvents="none"
            colors={[
              c.surfaceWarm,
              c.isDark ? "#183223E0" : "#FBF4E4D0",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={s.heroCopy}>
            <Text style={[s.headline, { color: c.text }]}>
              We’d love to{"\n"}hear from you.
            </Text>
            <Text style={[s.heroSub, { color: c.textSecondary }]}>
              For orders, inquiries or bulk/gift orders, feel free to contact
              us. Our team is always here to help!
            </Text>
          </View>
        </View>
        <Text style={[s.heading, { color: c.text }]}>Get in Touch</Text>
        {list(rows)}
        <Text style={[s.heading, { color: c.text }]}>More</Text>
        {list(more)}
        <Text style={[s.heading, { color: c.text }]}>Appearance</Text>
        <View
          style={[
            s.card,
            { padding: 14, backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          <Text style={[s.label, { color: c.text }]}>
            Choose your preferred app theme.
          </Text>
          <View style={s.segments}>
            {(["light", "dark"] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                accessibilityRole="button"
                accessibilityLabel={
                  mode === "light" ? "Light theme" : "Dark theme"
                }
                accessibilityState={{ selected: c.mode === mode }}
                onPress={() => setThemeMode(mode)}
                style={[
                  s.segment,
                  {
                    backgroundColor: c.mode === mode ? "#194D2A" : c.card,
                    borderColor: c.border,
                  },
                ]}
              >
                <Ionicons
                  name={mode === "light" ? "sunny-outline" : "moon-outline"}
                  size={21}
                  color={c.mode === mode ? "#fff" : c.text}
                />
                <Text
                  style={{
                    color: c.mode === mode ? "#fff" : c.text,
                    fontWeight: "700",
                  }}
                >
                  {mode === "light" ? "Light" : "Dark"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    minHeight: 210,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
  },
  heroImage: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "60%",
    height: "100%",
  },
  heroCopy: { width: "75%", padding: 16 },
  headline: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 31,
  },
  heroSub: { fontSize: 13, lineHeight: 19, marginTop: 10 },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 25,
    marginTop: 18,
    marginBottom: 8,
  },
  card: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, minWidth: 0 },
  label: { fontWeight: "700", fontSize: 15 },
  sub: { fontSize: 13, lineHeight: 18, marginTop: 3 },
  segments: { flexDirection: "row", gap: 8, marginTop: 12 },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
