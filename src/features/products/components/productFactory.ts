import type { Product } from '../../../types/product';

// Builds a Product-shaped object for the cart store from the exact-design
// screens where the catalogue is baked into the reference artwork.
export function asProduct(
  id: string,
  name: string,
  price: number,
  image: number | string
): Product {
  return {
    id,
    name,
    slug: id,
    description: '',
    categoryId: '',
    categoryName: '',
    price,
    variants: [{ label: '250g', price }],
    weight: '250g',
    stock: 25,
    images: [image],
    ingredients: [],
    benefits: [],
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isActive: true,
    createdAt: null,
    updatedAt: null,
  };
}
