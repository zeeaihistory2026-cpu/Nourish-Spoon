import { create } from 'zustand';

interface ToastState {
  message: string | null;
  /** Incremented to re-trigger the toast even for repeat messages. */
  seq: number;
  show: (message: string) => void;
  hide: () => void;
}

/**
 * Lightweight global toast. Call `useToastStore.getState().show('Added to cart')`
 * from anywhere (including non-component code like stores); the `ToastHost`
 * rendered in `AppProviders` displays it and auto-dismisses.
 */
export const useToastStore = create<ToastState>((set) => ({
  message: null,
  seq: 0,
  show: (message) => set((s) => ({ message, seq: s.seq + 1 })),
  hide: () => set({ message: null }),
}));

/** Convenience helper for non-component call sites. */
export function toast(message: string) {
  useToastStore.getState().show(message);
}
