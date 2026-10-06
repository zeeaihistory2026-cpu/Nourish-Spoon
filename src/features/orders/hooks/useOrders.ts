import { useCallback, useEffect, useState } from 'react';

import type { LoadState } from '../../../types/common';
import type { Order } from '../../../types/order';
import { useAuthStore } from '../../../store/authStore';
import { DEMO_MODE, demoOrdersAsOrders, useDemoStore } from '../../../demo/demo';
import { fetchOrder, fetchOrders, watchOrder } from '../services/orderService';

export function useOrders() {
  const uid = useAuthStore((state) => state.user?.uid);
  const demoOrders = useDemoStore((state) => state.orders);
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    if (DEMO_MODE) {
      setOrders(demoOrdersAsOrders());
      setState('ready');
      return;
    }
    if (!uid) {
      setState('ready');
      return;
    }
    setState('loading');
    try {
      setOrders(await fetchOrders(uid));
      setState('ready');
    } catch {
      setState('error');
    }
  }, [uid, demoOrders]);

  useEffect(() => {
    void load();
  }, [load]);

  return { orders, state, refresh: load };
}

export function useOrder(orderId: string) {
  const demoOrders = useDemoStore((state) => state.orders);
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    if (DEMO_MODE) {
      const found = demoOrdersAsOrders().find((entry) => entry.id === orderId) ?? null;
      setOrder(found);
      setState('ready');
      return;
    }
    let cancelled = false;
    setState('loading');
    fetchOrder(orderId)
      .then((result) => {
        if (cancelled) {
          return;
        }
        setOrder(result);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setState('error');
        }
      });
    // Live status updates while the tracking screen is open.
    const unsubscribe = watchOrder(orderId, (updated) => {
      if (!cancelled) {
        setOrder(updated);
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [orderId, demoOrders]);

  return { order, state };
}
