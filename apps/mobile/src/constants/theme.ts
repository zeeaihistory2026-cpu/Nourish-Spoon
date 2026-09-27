// ==============================================================================
// NOURISH SPOON: REACT NATIVE THEME TOKENS
// ==============================================================================

export interface ThemeType {
  mode: 'light' | 'dark';
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
  mode: 'light',
  isDark: false,
  primary: '#0D5428',          // Deep forest green
  primaryDark: '#073B21',      // Darker rich green
  primaryLight: '#1B743C',     // Leaf accent green
  background: '#FFF9EC',       // Warm parchment cream
  surface: '#FFFFFF',          // Clean white
  surfaceWarm: '#FBF4E4',      // Soft cream container
  card: '#FFFFFF',
  gold: '#C99B36',             // Warm Pakistan brass/gold
  goldLight: '#E2BB62',
  goldWarm: '#FFF3D6',
  accent: '#C99B36',
  text: '#10271A',             // Deep botanical black-green
  textSecondary: '#5A6D60',    // Muted green-gray
  textMuted: '#7E9687',
  border: '#E8DFC8',           // Warm cream border
  borderSubtle: '#F0E8D7',
  danger: '#EF4444',
  success: '#10B981',
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
};

export const DarkTheme: ThemeType = {
  mode: 'dark',
  isDark: true,
  primary: '#77A76A',          // Muted sage green
  primaryDark: '#0C1B12',
  primaryLight: '#8DC07F',
  background: '#0C1B12',       // Deep midnight forest
  surface: '#14291C',          // Forest card surface
  surfaceWarm: '#183223',
  card: '#183223',
  gold: '#D4AA52',
  goldLight: '#F3CF81',
  goldWarm: '#2E2812',
  accent: '#D4AA52',
  text: '#F7F1E5',             // Parchment cream white
  textSecondary: '#9BB2A4',
  textMuted: '#688573',
  border: '#24422F',
  borderSubtle: '#1C3524',
  danger: '#F87171',
  success: '#34D399',
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
};
