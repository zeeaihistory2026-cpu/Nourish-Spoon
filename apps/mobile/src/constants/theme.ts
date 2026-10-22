// ==============================================================================
// NOURISH SPOON: REACT NATIVE THEME TOKENS
// ==============================================================================

/** Shared action palette; white labels stay readable in both app themes. */
export const BUTTON_COLORS = {
  background: "#003E31",
  border: "#BC852B",
  text: "#FFFDF7",
} as const;

/** Fine gold edge shared by the app's action buttons. */
export const BUTTON_OUTLINE = {
  borderWidth: 1,
  borderColor: BUTTON_COLORS.border,
} as const;

export const WHATSAPP_BUTTON_COLORS = {
  background: "#25D366",
  text: "#083E2C",
} as const;

export interface ThemeType {
  mode: "light" | "dark";
  isDark: boolean;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  surface: string;
  surfaceWarm: string;
  card: string;
  gold: string;
  goldLight: string;
  goldWarm: string;
  accent: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  danger: string;
  success: string;
  whatsapp: string;
  whatsappDark: string;
}

export const LightTheme: ThemeType = {
  mode: "light",
  isDark: false,
  primary: "#003E31",
  primaryDark: "#002C23",
  primaryLight: "#436B50",
  background: "#FBF6ED",
  surface: "#FFFFFF", // Clean white
  surfaceWarm: "#F6EFE3",
  card: "#FFFFFF",
  gold: "#A96819",
  goldLight: "#E5C97A",
  goldWarm: "#FBF0D5",
  accent: "#C9A84C",
  text: "#103B32",
  textSecondary: "#555555",
  textMuted: "#888888",
  border: "#E8DFC8", // Warm cream border
  borderSubtle: "#F0E8D7",
  danger: "#EF4444",
  success: "#10B981",
  whatsapp: WHATSAPP_BUTTON_COLORS.background,
  whatsappDark: "#128C7E",
};

export const DarkTheme: ThemeType = {
  mode: "dark",
  isDark: true,
  primary: "#77A76A", // Muted sage green
  primaryDark: "#0C1B12",
  primaryLight: "#8DC07F",
  background: "#0C1B12", // Deep midnight forest
  surface: "#14291C", // Forest card surface
  surfaceWarm: "#183223",
  card: "#183223",
  gold: "#D4AA52",
  goldLight: "#F3CF81",
  goldWarm: "#2E2812",
  accent: "#D4AA52",
  text: "#F7F1E5", // Parchment cream white
  textSecondary: "#9BB2A4",
  textMuted: "#688573",
  border: "#24422F",
  borderSubtle: "#1C3524",
  danger: "#F87171",
  success: "#34D399",
  whatsapp: WHATSAPP_BUTTON_COLORS.background,
  whatsappDark: "#128C7E",
};
