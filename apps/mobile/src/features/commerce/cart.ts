import { Product, ProductVariant } from "@packages/types";

export type ShoppingLine = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export function reconcileCart(
  cart: ShoppingLine[],
  products: Product[],
): ShoppingLine[] {
  return cart.map((item) => {
    const product =
      products.find((p) => p.id === item.product.id) ||
      products.find((p) => p.slug && p.slug === item.product.slug);
    const variant = product?.variants.find(
      (v) => v.id === item.variant.id || v.weight === item.variant.weight,
    );
    return product && variant ? { ...item, product, variant } : item;
  });
}

/** Additional units allowed after accounting for this cart and shared stock. */
export function remainingCartQuantity(
  product: Product,
  variant: ProductVariant,
  cart: ShoppingLine[],
): number {
  const inVariant =
    cart.find((line) => line.variant.id === variant.id)?.quantity || 0;
  const inProduct = cart
    .filter((line) => line.product.id === product.id)
    .reduce((sum, line) => sum + line.quantity, 0);
  return Math.max(
    0,
    Math.min(
      20 - inVariant,
      variant.stock == null ? 20 : variant.stock - inVariant,
      product.legacy_stock == null ? 20 : product.legacy_stock - inProduct,
    ),
  );
}

/** Use the current catalogue, including legacy stock shared between sizes. */
export function cartIssue(
  cart: ShoppingLine[],
  products: Product[],
): string | null {
  for (const item of cart) {
    const product = products.find((product) => product.id === item.product.id);
    const variant = product?.variants.find(
      (variant) => variant.id === item.variant.id,
    );
    if (!product?.active || !variant?.active)
      return `${item.product.name} (${item.variant.weight}) is unavailable. Remove it to continue.`;
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    )
      return `Choose between 1 and 20 of ${product.name}.`;
    if (variant.stock != null && item.quantity > variant.stock)
      return `${product.name} (${variant.weight}) has ${variant.stock} available. Update your quantity to continue.`;
    if (
      product.legacy_stock != null &&
      cart
        .filter((line) => line.product.id === product.id)
        .reduce((sum, line) => sum + line.quantity, 0) > product.legacy_stock
    )
      return `${product.name} has ${product.legacy_stock} available across all sizes. Update your quantities to continue.`;
  }
  return null;
}
