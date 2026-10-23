import React, { useEffect, useRef } from "react";
import { AppScreen } from "../../navigation/types";
import {
  View,
  ScrollView,
  TextInput,
  TextInputProps,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFieldShake } from "../../hooks/useFieldShake";
import { TouchableOpacity } from "../../components/AppTouchable";
import { Header } from "../../components/Header";
import { Text, GreenButton } from "../../components/DesignPrimitives";
import { useMobileStore } from "../../services/storeService";

export function Page({
  title,
  back,
  children,
  subtitle,
  validationTick,
  validationPosition = "top",
  botanical = false,
}: {
  title: string;
  back: () => void;
  children: React.ReactNode;
  subtitle?: string;
  validationTick?: number;
  validationPosition?: "top" | "bottom";
  botanical?: boolean;
}) {
  const { theme } = useMobileStore();
  const scroll = useRef<ScrollView>(null);
  useEffect(() => {
    if (!validationTick) return;
    const frame = requestAnimationFrame(() => {
      if (validationPosition === "bottom")
        scroll.current?.scrollToEnd({ animated: true });
      else scroll.current?.scrollTo({ y: 0, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [validationTick, validationPosition]);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {botanical && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Image
            source={require("../../../assets/design/botanical.png")}
            resizeMode="contain"
            accessible={false}
            style={{
              position: "absolute",
              right: -30,
              top: 62,
              width: 135,
              height: 195,
              opacity: theme.isDark ? 0.13 : 0.45,
            }}
          />
        </View>
      )}
      <Header showBack onBack={back} rightAction="none" />
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.page}
      >
        <View style={{ marginBottom: 2 }}>
          <Text
            accessibilityRole="header"
            style={{
              fontFamily: "serif",
              fontSize: 34,
              lineHeight: 38,
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
          {subtitle && <Copy>{subtitle}</Copy>}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}
export function Card({ children }: { children: React.ReactNode }) {
  const { theme } = useMobileStore();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.isDark ? theme.surface : "#FFFCF5",
          borderColor: theme.border,
        },
      ]}
    >
      {children}
    </View>
  );
}
export function Heading({ children }: { children: React.ReactNode }) {
  return <Text style={styles.heading}>{children}</Text>;
}
export function Copy({ children }: { children: React.ReactNode }) {
  const { theme } = useMobileStore();
  return (
    <Text style={[styles.copy, { color: theme.textSecondary }]}>
      {children}
    </Text>
  );
}
export function Message({ children }: { children: React.ReactNode }) {
  return (
    <Text accessibilityRole="alert" style={styles.message}>
      {children}
    </Text>
  );
}
export function Field({
  label,
  error,
  validationTick,
  icon,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  validationTick?: number;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}) {
  const { theme } = useMobileStore();
  const offset = useFieldShake(error, validationTick);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 13, marginBottom: 5 }}>{label}</Text>
      <Animated.View style={{ transform: [{ translateX: offset }] }}>
        <View style={{ justifyContent: "center" }}>
          {icon && (
            <Ionicons
              pointerEvents="none"
              name={icon}
              size={20}
              color={theme.primary}
              style={{ position: "absolute", left: 12, zIndex: 1 }}
            />
          )}
          <TextInput
            {...props}
            accessibilityLabel={label}
            aria-invalid={!!error}
            placeholderTextColor={theme.textMuted}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: theme.surface,
              },
              props.multiline && { height: 90, textAlignVertical: "top" },
              props.style,
              icon && { paddingLeft: 40 },
              error && { borderColor: "#C62828", borderWidth: 1.5 },
            ]}
          />
        </View>
      </Animated.View>
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{
            color: "#C62828",
            fontSize: 12,
            lineHeight: 17,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
export function Choice({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const { theme } = useMobileStore();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.choice,
        {
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.surfaceWarm : theme.surface,
        },
      ]}
    >
      <Text style={{ fontSize: 14 }}>
        {selected ? "●  " : "○  "}
        {title}
      </Text>
    </TouchableOpacity>
  );
}
export function AccountGate({
  navigate,
}: {
  navigate: (name: AppScreen) => void;
}) {
  return (
    <Card>
      <Heading>Keep your orders together</Heading>
      <Copy>
        Sign in to save addresses, follow orders and review delivered products.
      </Copy>
      <GreenButton title="Sign In" onPress={() => navigate("Login")} />
    </Card>
  );
}
export const styles = StyleSheet.create({
  page: { padding: 16, paddingBottom: 20, gap: 12 },
  card: { padding: 14, borderWidth: 1, borderRadius: 14, gap: 10 },
  heading: {
    fontFamily: "serif",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 27,
  },
  copy: { fontSize: 14, lineHeight: 21 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Jost_400Regular",
  },
  choice: { borderWidth: 1, borderRadius: 10, minHeight: 46, padding: 12 },
  message: { fontSize: 14, lineHeight: 21, paddingVertical: 8 },
});
