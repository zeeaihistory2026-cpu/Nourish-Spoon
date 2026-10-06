import { useCallback, useEffect, useRef, useState } from 'react';

import type { LoadState } from '../../../types/common';
import type { Product, ProductSort } from '../../../types/product';
import {
  fetchFeaturedProducts,
  fetchProduct,
  fetchProducts,
  type FetchProductsParams,
} from '../services/productService';

interface UseProductsParams {
  categoryId?: string | null;
  search?: string;
}

export function useProducts({ categoryId, search }: UseProductsParams = {}) {
  const [items, setItems] = useState<Product[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [sort, setSort] = useState<ProductSort>('popular');
  const [cursor, setCursor] = useState<FetchProductsParams['cursor']>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setState('loading');
    try {
      const page = await fetchProducts({
        categoryId,
        search,
        sort,
      });
      if (requestId !== requestRef.current) {
        return;
      }
      setItems(page.items);
      setCursor(page.cursor);
      setState('ready');
    } catch {
      if (requestId === requestRef.current) {
        setState('error');
      }
    }
  }, [categoryId, search, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !cursor || state !== 'ready') {
      return;
    }
    setLoadingMore(true);
    try {
      const page = await fetchProducts({ categoryId, search, sort, cursor });
      setItems((prev) => {
        const known = new Set(prev.map((item) => item.id));
        return [...prev, ...page.items.filter((item) => !known.has(item.id))];
      });
      setCursor(page.cursor);
    } catch {
      // Keep the current page on failure; the user can retry by scrolling again.
    } finally {
      setLoadingMore(false);
    }
  }, [categoryId, cursor, loadingMore, search, sort, state]);

  return { items, state, sort, setSort, refresh: load, loadMore, loadingMore };
}

export function useFeaturedProducts(limit = 6) {
  const [items, setItems] = useState<Product[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    fetchFeaturedProducts(limit)
      .then((products) => {
        if (!cancelled) {
          setItems(products);
          setState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { items, state };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    fetchProduct(productId)
      .then((result) => {
        if (!cancelled) {
          setProduct(result);
          setState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { product, state };
}
