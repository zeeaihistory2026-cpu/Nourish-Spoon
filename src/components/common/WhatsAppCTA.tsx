import { WhatsAppIcon } from '../ui/BrandIcons';
import { AppText } from '../ui/AppText';
import { colors, radius, shadows } from '../../theme';

interface WhatsAppCTAProps {
  label: string;
  onPress: () => void;
}

// Full-width dark-green WhatsApp call-to-action used across the reference designs.
export function WhatsAppCTA({ label, onPress }: WhatsAppCTAProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
    >
      <WhatsAppIcon size={21} />
      <AppText variant="button" style={{ color: colors.white }}>
        {label}
      </AppText>
    </Pressable>
  );
}

import { Pressable, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    height: 54,
    ...shadows.green,
  },
});
