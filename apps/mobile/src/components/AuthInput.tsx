import React, { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

type Props = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showLabel?: boolean;
  password?: boolean;
};
export const AuthInput = forwardRef<TextInput, Props>(function AuthInput(
  { label, icon, showLabel = false, password = false, style, ...props },
  ref,
) {
  const { theme: c } = useMobileStore();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View
      style={[
        s.field,
        {
          backgroundColor: c.surface,
          borderColor: focused ? c.primary : c.border,
        },
      ]}
    >
      <Ionicons name={icon} size={23} color={c.primary} style={s.icon} />
      <View style={s.content}>
        {showLabel && <Text style={[s.label, { color: c.text }]}>{label}</Text>}
        <TextInput
          {...props}
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={c.textMuted}
          secureTextEntry={password && !visible}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          underlineColorAndroid="transparent"
          selectionColor={c.primary}
          cursorColor={c.primary}
          autoCorrect={false}
          style={[
            s.input,
            { color: c.text },
            Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {},
            style,
          ]}
        />
      </View>
      {password && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            visible
              ? "Hide " + label.toLowerCase()
              : "Show " + label.toLowerCase()
          }
          onPress={() => setVisible(!visible)}
          hitSlop={8}
          style={s.eye}
        >
          <Ionicons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={21}
            color={c.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});
const s = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 55,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  icon: { marginRight: 15 },
  content: { minWidth: 0, flex: 1, justifyContent: "center", paddingVertical: 8 },
  label: {
    fontFamily: "Lato_700Bold",
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 1,
  },
  input: {
    width: "100%",
    minWidth: 0,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
    lineHeight: 19,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    minHeight: 23,
  },
  eye: {
    width: 30,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
});
