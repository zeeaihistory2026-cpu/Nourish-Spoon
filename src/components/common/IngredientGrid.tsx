import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { colors, radius } from '../../theme';
import type { Ingredient } from '../../types/product';

interface IngredientGridProps {
  ingredients: Ingredient[];
  columns?: number;
}

// Photo tiles of natural ingredients; falls back to a warm glyph tile when no
// photo is available in the product data.
export function IngredientGrid({ ingredients, columns = 5 }: IngredientGridProps) {
  return (
    <View style={styles.grid}>
      {ingredients.map((ingredient) => (
        <View
          key={ingredient.name}
          style={[styles.tile, { width: `${100 / columns - 2.4}%` }]}
        >
          <View style={styles.photoWrap}>
            {ingredient.imageUrl ? (
              <Image
                source={ingredient.imageUrl}
                style={styles.photo}
                contentFit="cover"
                transition={150}
              />
            ) : (
              <AppText style={styles.emoji}>{ingredient.emoji ?? 'ðŸŒ¿'}</AppText>
            )}
          </View>
          <AppText variant="microRegular" color="text" style={styles.name} numberOfLines={2}>
            {ingredient.name}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  photoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.goldBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  name: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 13,
  },
});
