"use client";
// cart context is used to manage the cart state in the client across components
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
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
} from "./cart-mutations";
import { useCartTray } from "./cart-tray-context";

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

type CartContextState = {
  cart: CartWithProducts | null;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextState | null>(null);

export function CartProvider({
  initialCart = null,
  children,
}: {
  initialCart?: CartWithProducts | null;
  children: ReactNode;
}) {
  const { runCartAction } = useCartTray();
  // manage cart from server in client state, update it with mutations.
  const [cartState, setCart] = useState<CartWithProducts | null>(initialCart);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const [cart, applyOptimistic] = useOptimistic<
    CartWithProducts | null,
    OptimisticAction
  >(cartState, cartReducer);

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      runCartAction(async () => {
        applyOptimistic({ type: "add", product, quantity });
        const updatedCart = await addToCartAction(product, quantity);
        if (updatedCart) setCart(updatedCart);
      });
    },
    [runCartAction, applyOptimistic],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      runCartAction(async () => {
        applyOptimistic({ type: "updateQuantity", productId, quantity });
        const updatedCart = await updateCartQuantityAction(productId, quantity);
        if (updatedCart) setCart(updatedCart);
      });
    },
    [runCartAction, applyOptimistic],
  );

  const removeItem = useCallback(
    (productId: string) => {
      runCartAction(async () => {
        applyOptimistic({ type: "remove", productId });
        const updatedCart = await removeFromCartAction(productId);
        if (updatedCart) setCart(updatedCart);
      });
    },
    [runCartAction, applyOptimistic],
  );

  const clear = useCallback(() => {
    runCartAction(async () => {
      applyOptimistic({ type: "clear" });
      const updatedCart = await clearCartAction();
      if (updatedCart) setCart(updatedCart);
    });
  }, [runCartAction, applyOptimistic]);

  const value = useMemo(
    () => ({ cart, addItem, updateQuantity, removeItem, clear }),
    [cart, addItem, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartData(): CartContextState {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartData must be used within a CartDataProvider");
  }
  return ctx;
}
