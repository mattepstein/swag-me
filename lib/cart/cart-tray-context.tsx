"use client";
// cart tray context is used to manage the cart tray state and actions from across components
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

type CartTrayState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** True while any cart server action (and its revalidation) is in flight. */
  isPending: boolean;
  /**
   * Wrap a cart server action in a transition so `isPending` stays true
   * until both the action and the downstream revalidation have finished.
   */
  runCartAction: (action: () => Promise<void>) => void;
};

const CartTrayContext = createContext<CartTrayState | null>(null);

export function CartTrayProvider({ children }: { children: ReactNode }) {
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
    <CartTrayContext.Provider value={value}>
      {children}
    </CartTrayContext.Provider>
  );
}

export function useCartTray(): CartTrayState {
  const ctx = useContext(CartTrayContext);
  if (!ctx) {
    throw new Error("useCartTray must be used within a CartTrayProvider");
  }
  return ctx;
}
