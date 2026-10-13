import React, { forwardRef, useState, useEffect, useRef } from "react";
import {
  Animated,
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from "react-native";
import { TouchableOpacity } from "./AppTouchable";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./DesignPrimitives";
import { useMobileStore } from "../services/storeService";

type Props = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showLabel?: boolean;
  password?: boolean;
  error?: string;
  validationTick?: number;
  reduceMotion?: boolean;
};
export const AuthInput = forwardRef<TextInput, Props>(function AuthInput(
  {
    label,
    icon,
    showLabel = false,
    password = false,
    error,
    validationTick,
    reduceMotion = true,
    style,
    ...props
  },
  ref,
) {
  const { theme: c } = useMobileStore();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const offset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!error || reduceMotion) return;
    const animation = Animated.sequence(
      [-5, 5, -4, 4, 0].map((value) =>
        Animated.timing(offset, {
          toValue: value,
          duration: 40,
          useNativeDriver: Platform.OS !== "web",
        }),
      ),
    );
    animation.start();
    return () => {
      animation.stop();
      offset.setValue(0);
    };
  }, [error, validationTick, reduceMotion, offset]);
  useEffect(() => {
    if (Platform.OS !== "web" || document.getElementById("nourish-auth-white"))
      return;
    const css = document.createElement("style");
    css.id = "nourish-auth-white";
    css.textContent =
      'input[data-auth-input="true"]:-webkit-autofill,input[data-auth-input="true"]:autofill{-webkit-box-shadow:0 0 0 1000px white inset!important;box-shadow:0 0 0 1000px white inset!important;-webkit-text-fill-color:#183320!important;caret-color:#1B4332!important}';
    document.head.appendChild(css);
  }, []);
  return (
    <View style={{ marginBottom: 10 }}>
      <Animated.View
        style={[
          s.field,
          {
            backgroundColor: "#FFFFFF",
            borderColor: error ? "#C62828" : focused ? c.primary : c.border,
            transform: [{ translateX: offset }],
          },
        ]}
      >
        <Ionicons name={icon} size={23} color={c.primary} style={s.icon} />
        <View style={s.content}>
          {showLabel && (
            <Text style={[s.label, { color: "#183320" }]}>{label}</Text>
          )}
          <TextInput
            {...props}
            ref={ref}
            accessibilityLabel={label}
            placeholderTextColor="#7E8981"
            {...(Platform.OS === "web"
              ? ({
                  dataSet: { authInput: "true" },
                  "aria-invalid": !!error,
                } as any)
              : {})}
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
              { color: "#183320", backgroundColor: "#FFFFFF" },
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
              color="#667469"
            />
          </TouchableOpacity>
        )}
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
});
const s = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 55,
    paddingHorizontal: 14,
  },
  icon: { marginRight: 15 },
  content: {
    minWidth: 0,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  label: {
    fontFamily: "Jost_700Bold",
    fontSize: 13,
    lineHeight: 17,
    marginBottom: 1,
  },
  input: {
    width: "100%",
    minWidth: 0,
    fontFamily: "Jost_400Regular",
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
