import { useState } from "react";
import { View, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Header } from "../../components/Header";
import { Text } from "../../components/DesignPrimitives";
import { TouchableOpacity } from "../../components/AppTouchable";
import { useMobileStore } from "../../services/storeService";
import { AppNavigation } from "../../navigation/types";
import { EmbeddedCourier } from "./EmbeddedCourier";

export function TcsTrackingScreen({
  navigation,
  trackingNumber,
}: {
  navigation: AppNavigation;
  trackingNumber: string;
}) {
  const { theme } = useMobileStore();
  const [copied, setCopied] = useState(false);
  const number = /^\d{8,20}$/.test(trackingNumber) ? trackingNumber : "";
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header showBack onBack={navigation.goBack} rightAction="none" />
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={styles.title}>
          TCS Tracking
        </Text>
        <Text style={{ fontSize: 13, color: theme.textSecondary }}>
          Live results from the official TCS website.
        </Text>
        {!!number && (
          <View
            style={[
              styles.number,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                Consignment number
              </Text>
              <Text selectable style={{ fontSize: 18 }}>
                {number}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Copy tracking number"
              style={styles.copy}
              onPress={async () => {
                try {
                  await Clipboard.setStringAsync(number);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Text style={{ color: theme.primary }}>
                {copied ? "Copied" : "Copy"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <EmbeddedCourier trackingNumber={number} />
    </View>
  );
}
const styles = StyleSheet.create({
  heading: { paddingHorizontal: 18, paddingVertical: 12, gap: 6 },
  title: { fontFamily: "serif", fontSize: 30, fontWeight: "700" },
  number: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  copy: {
    minWidth: 58,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
