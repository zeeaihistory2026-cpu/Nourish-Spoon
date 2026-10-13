// ==============================================================================
// NOURISH SPOON: REACT NATIVE THEME TOKENS
// ==============================================================================

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
  primary: "#1B4332", // Website forest green
  primaryDark: "#1B4332",
  primaryLight: "#2D6A4F",
  background: "#FDF6E3", // Website cream
  surface: "#FFFFFF", // Clean white
  surfaceWarm: "#FAF3E0",
  card: "#FFFFFF",
  gold: "#C9A84C",
  goldLight: "#E5C97A",
  goldWarm: "#FBF0D5",
  accent: "#C9A84C",
  text: "#1B4332",
  textSecondary: "#555555",
  textMuted: "#888888",
  border: "#E8DFC8", // Warm cream border
  borderSubtle: "#F0E8D7",
  danger: "#EF4444",
  success: "#10B981",
  whatsapp: "#25D366",
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
  whatsapp: "#25D366",
  whatsappDark: "#128C7E",
};
