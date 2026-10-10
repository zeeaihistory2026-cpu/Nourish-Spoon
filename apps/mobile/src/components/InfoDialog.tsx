import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text, GreenButton } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

/** Accessible, scrollable messages on Android, iOS and the web preview. */
export function useInfoDialog() {
  const [message, setMessage] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const { theme } = useMobileStore();
  const close = () => setMessage(null);
  const dialog = (
    <Modal
      visible={!!message}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          accessibilityLabel="Close message"
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: theme.surface }]}
        >
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.text }]}
          >
            {message?.title}
          </Text>
          <ScrollView style={{ flexShrink: 1 }}>
            <Text style={[styles.body, { color: theme.textSecondary }]}>
              {message?.body}
            </Text>
          </ScrollView>
          <GreenButton
            title="Got it"
            onPress={close}
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    </Modal>
  );
  return {
    showInfo: (title: string, body: string) => setMessage({ title, body }),
    dialog,
  };
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 22,
    padding: 22,
    maxHeight: "80%",
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  title: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 14,
  },
  body: { fontSize: 14, lineHeight: 22 },
});
