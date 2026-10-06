import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from '@react-native-firebase/firestore';

import { db } from '../../../services/firebase/config';
import { docToEntity, docsToEntities } from '../../../services/firebase/firestore';
import { DEMO_CATEGORIES, DEMO_MODE, DEMO_PRODUCTS } from '../../../demo/demo';
import type { Category, Product, ProductSort } from '../../../types';

export const PRODUCTS_PAGE_SIZE = 10;

export interface ProductPage {
  items: Product[];
  cursor: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
}

export interface FetchProductsParams {
  categoryId?: string | null;
  search?: string;
  sort?: ProductSort;
  limit?: number;
  cursor?: DocumentSnapshot<DocumentData, DocumentData> | null;
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductPage> {
  if (DEMO_MODE) {
    return { items: filterAndSortDemoProducts(params), cursor: null };
  }

  let pageQuery = query(collection(db, 'products'), where('isActive', '==', true));

  if (params.categoryId) {
    pageQuery = query(pageQuery, where('categoryId', '==', params.categoryId));
  }

  const search = params.search?.trim().toLowerCase();
  if (search) {
    // Prefix search on a denormalised nameLower field.
    pageQuery = query(pageQuery, orderBy('nameLower'), startAt(search), endAt(`${search}\uf8ff`));
  } else {
    switch (params.sort) {
      case 'price_asc':
        pageQuery = query(pageQuery, orderBy('price', 'asc'));
        break;
      case 'price_desc':
        pageQuery = query(pageQuery, orderBy('price', 'desc'));
        break;
      default:
        pageQuery = query(pageQuery, orderBy('reviewCount', 'desc'));
    }
  }

  pageQuery = query(pageQuery, limit(params.limit ?? PRODUCTS_PAGE_SIZE));
  if (params.cursor) {
    pageQuery = query(pageQuery, startAfter(params.cursor));
  }

  const snapshot = await getDocs(pageQuery);
  const items = docsToEntities<Product>(snapshot);
  const last = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  return { items, cursor: last };
}

export async function fetchProduct(productId: string): Promise<Product | null> {
  if (DEMO_MODE) {
    return DEMO_PRODUCTS.find((product) => product.id === productId) ?? null;
  }
  const snapshot = await getDoc(doc(db, 'products', productId));
  return docToEntity<Product>(snapshot);
}

export async function fetchFeaturedProducts(limitValue = 6): Promise<Product[]> {
  if (DEMO_MODE) {
    return [...DEMO_PRODUCTS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limitValue);
  }
  const snapshot = await getDocs(
    query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      orderBy('rating', 'desc'),
      limit(limitValue)
    )
  );
  return docsToEntities<Product>(snapshot);
}

export async function fetchCategories(): Promise<Category[]> {
  if (DEMO_MODE) {
    return DEMO_CATEGORIES;
  }
  const snapshot = await getDocs(
    query(collection(db, 'categories'), orderBy('sortOrder', 'asc'))
  );
  return docsToEntities<Category>(snapshot);
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (DEMO_MODE) {
    return ids
      .map((id) => DEMO_PRODUCTS.find((product) => product.id === id))
      .filter((product): product is Product => product !== undefined);
  }
  if (ids.length === 0) {
    return [];
  }
  const snapshots = await Promise.all(
    ids.map((id) => getDoc(doc(db, 'products', id)))
  );
  return snapshots
    .map((snapshot) => docToEntity<Product>(snapshot))
    .filter((product): product is Product => product !== null);
}

function filterAndSortDemoProducts(params: FetchProductsParams): Product[] {
  const search = params.search?.trim().toLowerCase();
  let items = DEMO_PRODUCTS.filter((product) => {
    if (params.categoryId && product.categoryId !== params.categoryId) {
      return false;
    }
    if (search && !product.name.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });
  switch (params.sort) {
    case 'price_asc':
      items = items.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      items = items.sort((a, b) => b.price - a.price);
      break;
    default:
      items = items.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  const offset = 0;
  return items.slice(offset, params.limit ?? PRODUCTS_PAGE_SIZE);
}
