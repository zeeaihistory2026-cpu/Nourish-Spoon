import { useCallback, useEffect, useState } from 'react';

import type { LoadState } from '../../../types/common';
import type { Category } from '../../../types/product';
import { fetchCategories } from '../services/productService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    setState('loading');
    try {
      setCategories(await fetchCategories());
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { categories, state, refresh: load };
}
