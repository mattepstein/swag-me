"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

type CartUIContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** True while any cart server action (and its revalidation) is in flight. */
  isPending: boolean;
  /**
   * Wrap a cart server action in a transition so `isPending` stays true
   * until both the action and the downstream RSC revalidation have finished.
   */
  runCartAction: (action: () => Promise<void>) => void;
};

const CartUIContext = createContext<CartUIContextValue | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const runCartAction = useCallback(
    (action: () => Promise<void>) => {
      startTransition(async () => {
        await action();
      });
    },
    [startTransition],
  );

  const value = useMemo(
    () => ({ isOpen, open, close, toggle, isPending, runCartAction }),
    [isOpen, open, close, toggle, isPending, runCartAction],
  );

  return (
    <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
  );
}

export function useCartUI(): CartUIContextValue {
  const ctx = useContext(CartUIContext);
  if (!ctx) {
    throw new Error("useCartUI must be used within a CartUIProvider");
  }
  return ctx;
}
