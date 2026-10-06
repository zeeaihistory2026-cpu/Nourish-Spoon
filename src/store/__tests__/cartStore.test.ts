import { cartItemKey, cartTotals, deliveryFeeFor, useCartStore, type CartItem } from '../cartStore';
import type { Product } from '../../types/product';

const panjeeriVariant = { label: '250g', price: 1499 };

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'classic-panjeeri',
    name: 'Classic Panjeeri',
    slug: 'classic-panjeeri',
    description: '',
    categoryId: 'panjeeri',
    categoryName: 'Panjeeri',
    price: 1499,
    variants: [panjeeriVariant, { label: '500g', price: 2899 }],
    weight: '250g',
    stock: 10,
    images: [],
    ingredients: [],
    benefits: [],
    rating: 4.9,
    reviewCount: 62,
    isFeatured: true,
    isActive: true,
    createdAt: null,
    updatedAt: null,
    ...overrides,
  };
}

const ballsItem: CartItem = {
  productId: 'date-nut-balls',
  name: 'Date & Nut Balls',
  variantLabel: '250g',
  image: '',
  price: 1999,
  qty: 1,
};

describe('cartTotals', () => {
  it('sums line items into a subtotal', () => {
    const totals = cartTotals([ballsItem, { ...ballsItem, qty: 2, price: 1499 }]);
    expect(totals.subtotal).toBe(1999 + 2998);
    expect(totals.count).toBe(3);
  });

  it('charges delivery below the free threshold', () => {
    const totals = cartTotals([ballsItem]);
    expect(totals.deliveryFee).toBe(150);
    expect(totals.total).toBe(2149);
  });

  it('gives free delivery at or above the threshold', () => {
    expect(deliveryFeeFor(2499)).toBe(150);
    expect(deliveryFeeFor(2500)).toBe(0);
    expect(deliveryFeeFor(5000)).toBe(0);
  });

  it('never charges delivery on an empty cart', () => {
    expect(deliveryFeeFor(0)).toBe(0);
    const totals = cartTotals([]);
    expect(totals).toEqual({ subtotal: 0, deliveryFee: 0, total: 0, count: 0 });
  });
});

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it('adds a product variant with its quantity', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 2);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]?.qty).toBe(2);
    expect(items[0]?.price).toBe(1499);
    expect(items[0]?.variantLabel).toBe('250g');
  });

  it('merges quantities for the same product variant', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 1);
    useCartStore.getState().addItem(product, product.variants[0]!, 2);
    expect(useCartStore.getState().items[0]?.qty).toBe(3);
  });

  it('treats different variants as separate lines', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 1);
    useCartStore.getState().addItem(product, product.variants[1]!, 1);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('increments and decrements by cart key', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 2);
    const key = cartItemKey('classic-panjeeri', '250g');
    useCartStore.getState().increment(key);
    expect(useCartStore.getState().items[0]?.qty).toBe(3);
    useCartStore.getState().decrement(key);
    expect(useCartStore.getState().items[0]?.qty).toBe(2);
  });

  it('removes the line when quantity drops to zero', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 1);
    useCartStore.getState().decrement(cartItemKey('classic-panjeeri', '250g'));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('caps quantity at the per-line maximum', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 1);
    const key = cartItemKey('classic-panjeeri', '250g');
    for (let i = 0; i < 120; i++) {
      useCartStore.getState().increment(key);
    }
    expect(useCartStore.getState().items[0]?.qty).toBe(99);
  });

  it('removes a single product and clears the cart', () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, product.variants[0]!, 1);
    useCartStore.getState().addItem(makeProduct({ id: 'date-nut-balls' }), { label: '250g', price: 1999 }, 1);
    useCartStore.getState().removeItem(cartItemKey('classic-panjeeri', '250g'));
    expect(useCartStore.getState().items).toHaveLength(1);
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
