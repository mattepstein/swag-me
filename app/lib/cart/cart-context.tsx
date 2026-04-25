"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  type ReactNode,
} from "react";
import type {
  CartItemWithProduct,
  CartWithProducts,
} from "@/app/lib/models/cart";
import type { Product } from "@/app/lib/models/product";
import {
  addToCart as addToCartAction,
  updateCartQuantity as updateCartQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
} from "@/app/lib/cart/cart";
import { useCartUI } from "../../ui/cart/cart-ui-context";

type OptimisticAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "updateQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

const EMPTY_CART: CartWithProducts = {
  token: "",
  items: [],
  totalItems: 0,
  subtotal: 0,
  currency: "USD",
  createdAt: "",
  updatedAt: "",
};

function recalcTotals(items: CartItemWithProduct[]) {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  return { totalItems, subtotal };
}

function cartReducer(
  state: CartWithProducts | null,
  action: OptimisticAction,
): CartWithProducts {
  const base = state ?? EMPTY_CART;

  switch (action.type) {
    case "add": {
      const existingIdx = base.items.findIndex(
        (i) => i.productId === action.product.id,
      );
      let items: CartItemWithProduct[];
      if (existingIdx >= 0) {
        const line = base.items[existingIdx];
        const quantity = line.quantity + action.quantity;
        items = base.items.with(existingIdx, {
          ...line,
          quantity,
          lineTotal: line.product.price * quantity,
        });
      } else {
        const newLine: CartItemWithProduct = {
          productId: action.product.id,
          product: action.product,
          quantity: action.quantity,
          lineTotal: action.product.price * action.quantity,
          addedAt: new Date().toISOString(),
        };
        items = [...base.items, newLine];
      }
      return { ...base, items, ...recalcTotals(items) };
    }
    case "updateQuantity": {
      const items = base.items
        .map((i) =>
          i.productId === action.productId
            ? {
                ...i,
                quantity: action.quantity,
                lineTotal: i.product.price * action.quantity,
              }
            : i,
        )
        .filter((i) => i.quantity > 0);
      return { ...base, items, ...recalcTotals(items) };
    }
    case "remove": {
      const items = base.items.filter((i) => i.productId !== action.productId);
      return { ...base, items, ...recalcTotals(items) };
    }
    case "clear":
      return { ...base, items: [], totalItems: 0, subtotal: 0 };
  }
}

type CartDataContextValue = {
  cart: CartWithProducts | null;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartDataContext = createContext<CartDataContextValue | null>(null);

export function CartDataProvider({
  initialCart = null,
  children,
}: {
  initialCart?: CartWithProducts | null;
  children: ReactNode;
}) {
  const { runCartAction } = useCartUI();
  const [cart, applyOptimistic] = useOptimistic<
    CartWithProducts | null,
    OptimisticAction
  >(initialCart, cartReducer);

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      runCartAction(async () => {
        applyOptimistic({ type: "add", product, quantity });
        await addToCartAction(product, quantity);
      });
    },
    [runCartAction, applyOptimistic],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      runCartAction(async () => {
        applyOptimistic({ type: "updateQuantity", productId, quantity });
        await updateCartQuantityAction(productId, quantity);
      });
    },
    [runCartAction, applyOptimistic],
  );

  const removeItem = useCallback(
    (productId: string) => {
      runCartAction(async () => {
        applyOptimistic({ type: "remove", productId });
        await removeFromCartAction(productId);
      });
    },
    [runCartAction, applyOptimistic],
  );

  const clear = useCallback(() => {
    runCartAction(async () => {
      applyOptimistic({ type: "clear" });
      await clearCartAction();
    });
  }, [runCartAction, applyOptimistic]);

  const value = useMemo(
    () => ({ cart, addItem, updateQuantity, removeItem, clear }),
    [cart, addItem, updateQuantity, removeItem, clear],
  );

  return (
    <CartDataContext.Provider value={value}>
      {children}
    </CartDataContext.Provider>
  );
}

export function useCartData(): CartDataContextValue {
  const ctx = useContext(CartDataContext);
  if (!ctx) {
    throw new Error("useCartData must be used within a CartDataProvider");
  }
  return ctx;
}
