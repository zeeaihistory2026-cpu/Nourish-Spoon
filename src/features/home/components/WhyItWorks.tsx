import { FlaskConical, ShieldCheck, Sprout, Zap, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/ui/AppText';
import { colors } from '../../../theme';

const TILES: { icon: LucideIcon; label: string[] }[] = [
  { icon: Zap, label: ['Energy', 'Boosting'] },
  { icon: FlaskConical, label: ['Protein', 'Rich'] },
  { icon: Sprout, label: ['Fibre', 'Rich'] },
  { icon: ShieldCheck, label: ['No', 'Preservatives'] },
];

export function WhyItWorks() {
  return (
    <View style={styles.row}>
      {TILES.map(({ icon: Icon, label }) => (
        <View key={label.join(' ')} style={styles.tile}>
          <View style={styles.iconCircle}>
            <Icon size={17} color={colors.goldDark} strokeWidth={2} />
          </View>
          <AppText variant="micro" color="greenMid" style={styles.tileLabel}>
            {label[0]}
            {'\n'}
            {label[1]}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    textAlign: 'center',
    lineHeight: 13,
  },
});
