import { FileText, Heart, ShoppingCart } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { Stars } from '../ui/Stars';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { FONT_FAMILY, colors, radius, shadows } from '../../theme';
import { formatPrice } from '../../utils/currency';
import type { Product, ProductVariant } from '../../types/product';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
  selectedVariant?: ProductVariant;
  onSelectVariant?: (variant: ProductVariant) => void;
  onPress?: () => void;
  onAddToCart?: (variant: ProductVariant) => void;
  onToggleWishlist?: () => void;
  wishlisted?: boolean;
  onWhatsApp?: () => void;
}

export function ProductCard({
  product,
  layout = 'grid',
  selectedVariant,
  onSelectVariant,
  onPress,
  onAddToCart,
  onToggleWishlist,
  wishlisted = false,
  onWhatsApp,
}: ProductCardProps) {
  const variant = selectedVariant ?? product.variants[0] ?? null;
  const minPrice = product.variants.reduce(
    (min, entry) => Math.min(min, entry.price),
    product.variants[0]?.price ?? product.price
  );
  const cheapestVariant =
    product.variants.find((entry) => entry.price === minPrice) ??
    product.variants[0] ??
    null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        layout === 'list' && styles.cardList,
        pressed && { opacity: 0.97 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={product.name}
    >
      <View style={layout === 'list' ? styles.photoList : styles.photoGrid}>
        <Image
          source={product.images[0] ?? ''}
          style={styles.image}
          contentFit="cover"
          transition={200}
          recyclingKey={product.id}
        />
        {onToggleWishlist ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onToggleWishlist();
            }}
            accessibilityRole="button"
            accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            hitSlop={5}
            style={({ pressed }) => [styles.heartButton, pressed && { opacity: 0.85 }]}
          >
            <Heart
              size={18}
              color="#E5484D"
              fill={wishlisted ? '#E5484D' : 'transparent'}
              strokeWidth={2}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.body}>
        <AppText variant="productTitleSmall" color="greenDark">
          {product.name}
        </AppText>
        <View style={styles.ratingRow}>
          <Stars rating={product.rating} size={13} />
          <AppText variant="ratingValue" color="greenDark">
            {product.rating.toFixed(1)}
          </AppText>
          <AppText variant="ratingCount" color="textMid">
            ({product.reviewCount} reviews)
          </AppText>
        </View>

        {layout === 'list' ? (
          <AppText variant="body" color="textMid" style={styles.description}>
            {product.description}
          </AppText>
        ) : null}

        {layout === 'list' && product.variants.length > 1 && onSelectVariant ? (
          <View style={styles.variantRow}>
            {product.variants.map((entry) => {
              const active = variant?.label === entry.label;
              return (
                <Pressable
                  key={entry.label}
                  onPress={() => onSelectVariant(entry)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[styles.variantChip, active && styles.variantChipOn]}
                >
                  <View style={styles.variantTextWrap}>
                    <AppText variant="microRegular" color={active ? 'greenMid' : 'textLight'}>
                      {entry.label}
                    </AppText>
                    <AppText variant="priceValue" style={{ color: active ? colors.greenDark : colors.text }}>
                      {formatPrice(entry.price)}
                    </AppText>
                  </View>
                  <View style={[styles.radio, active && styles.radioOn]}>
                    {active ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.footer}>
          <View>
            {layout === 'list' ? (
              <AppText variant="microRegular" color="textMid">
                From
              </AppText>
            ) : null}
            <AppText variant="priceFrom" color="greenDark">
              {layout === 'list'
                ? formatPrice(minPrice)
                : `${cheapestVariant?.label ?? ''} · ${formatPrice(minPrice)}`}
            </AppText>
          </View>
          {layout === 'grid' && onAddToCart && variant ? (
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                onAddToCart(variant);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Add ${product.name} to cart`}
              style={({ pressed }) => [styles.cartButton, pressed && { opacity: 0.85 }]}
            >
              <ShoppingCart size={19} color={colors.white} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>

        {layout === 'list' ? (
          <View style={styles.actionRow}>
            {onWhatsApp ? (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  onWhatsApp();
                }}
                accessibilityRole="button"
                accessibilityLabel="Order on WhatsApp"
                style={({ pressed }) => [styles.whatsappButton, pressed && { opacity: 0.9 }]}
              >
                <WhatsAppIcon size={18} />
                <AppText variant="bodySemibold" style={{ color: colors.white }}>
                  Order on WhatsApp
                </AppText>
              </Pressable>
            ) : null}
            {onPress ? (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  onPress();
                }}
                accessibilityRole="button"
                accessibilityLabel="View product"
                style={({ pressed }) => [styles.viewButton, pressed && { opacity: 0.85 }]}
              >
                <FileText size={17} color={colors.greenDark} strokeWidth={1.9} />
                <AppText variant="bodySemibold" color="greenDark">
                  View Product
                </AppText>
              </Pressable>
            ) : null}
            {onAddToCart && variant ? (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  onAddToCart(variant);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Add ${product.name} to cart`}
                style={({ pressed }) => [styles.cartChip, pressed && { opacity: 0.85 }]}
              >
                <ShoppingCart size={19} color={colors.greenDark} strokeWidth={2} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.creamLight,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardList: {
    marginBottom: 4,
  },
  photoGrid: {
    height: 150,
    backgroundColor: colors.imageBg,
  },
  photoList: {
    height: 210,
    backgroundColor: colors.imageBg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  body: {
    padding: 13,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },
  description: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 20,
  },
  variantRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  variantChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  variantChipOn: {
    backgroundColor: '#EFF5EC',
    borderColor: colors.greenMid,
    borderWidth: 1.6,
  },
  variantTextWrap: {
    alignItems: 'center',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.6,
    borderColor: colors.checkbox,
  },
  radioOn: {
    borderColor: colors.greenMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.greenDark,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 12,
  },
  whatsappButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.greenDark,
    borderRadius: radius.pill,
    height: 46,
  },
  viewButton: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: colors.white,
    borderWidth: 1.3,
    borderColor: colors.border,
    borderRadius: radius.pill,
    height: 46,
  },
  cartChip: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.goldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
