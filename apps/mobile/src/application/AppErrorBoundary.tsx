import { BUTTON_COLORS, BUTTON_OUTLINE } from "../constants/theme";
import { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "../components/AppTouchable";

/** Keep unexpected rendering failures recoverable without depending on app state. */
export class AppErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={s.container}>
        <Text accessibilityRole="header" style={s.title}>
          Let’s try that again
        </Text>
        <Text style={s.copy}>
          Something interrupted the app. Your saved shopping data is still on
          this device.
        </Text>
        <TouchableOpacity
          accessibilityLabel="Reload app"
          style={s.button}
          onPress={() => this.setState({ failed: false })}
        >
          <Text style={s.label}>Reload App</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 18,
    backgroundColor: "#FDF6E3",
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1B4332",
    textAlign: "center",
  },
  copy: {
    fontSize: 15,
    lineHeight: 23,
    color: "#555555",
    textAlign: "center",
    maxWidth: 360,
  },
  button: {
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 28,
    ...BUTTON_OUTLINE,
    backgroundColor: BUTTON_COLORS.background,
    borderRadius: 12,
  },
  label: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
