import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '../ui/AppText';
import { colors } from '../../theme';

interface CategoryChipsProps {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}

export function CategoryChips({ categories, value, onChange }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const active = category === value;
        return (
          <Pressable
            key={category}
            onPress={() => onChange(category)}
            style={[styles.chip, active && styles.chipOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <AppText variant="small" style={{ color: active ? colors.white : colors.textMid }}>
              {category}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.greenMid,
    borderColor: colors.greenMid,
  },
});
