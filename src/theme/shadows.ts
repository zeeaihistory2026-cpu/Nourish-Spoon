import { Platform, type ViewStyle } from 'react-native';

function shadow(color: string, height: number, blur: number, elevation: number): ViewStyle {
  if (Platform.OS === 'android') {
    return { elevation };
  }
  return {
    shadowColor: color,
    shadowOpacity: 1,
    shadowRadius: blur,
    shadowOffset: { width: 0, height },
  };
}

export const shadows = {
  sm: shadow('rgba(27, 67, 50, 0.06)', 2, 8, 1),
  md: shadow('rgba(27, 67, 50, 0.10)', 4, 20, 3),
  lg: shadow('rgba(27, 67, 50, 0.15)', 8, 30, 6),
  gold: shadow('rgba(135, 112, 33, 0.34)', 8, 22, 4),
  green: shadow('rgba(27, 67, 50, 0.28)', 10, 26, 5),
  whatsapp: shadow('rgba(37, 211, 102, 0.30)', 8, 20, 4),
  soft: shadow('rgba(27, 67, 50, 0.06)', 6, 20, 2),
} as const;
