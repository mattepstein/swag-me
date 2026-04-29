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

import type { Promotion } from "@/app/lib/models/promotion";
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

export type CartClientState = CartWithProducts & {
  promotion: Promotion | null;
  discount: number;
  total: number;
};

const EMPTY_CART: CartWithProducts = {
  token: "",
  items: [],
  totalItems: 0,
  subtotal: 0,
  currency: "USD",
  createdAt: "",
  updatedAt: "",
};

function recalcTotals(
  items: CartItemWithProduct[],
  promotion: Promotion | null,
) {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const discount = Math.round(
    (subtotal * (promotion?.discountPercent ?? 0)) / 100,
  );
  const total = Math.max(0, subtotal - discount);
  return { totalItems, subtotal, discount, total };
}

function withClientTotals(
  cart: CartWithProducts | null,
  promotion: Promotion | null,
): CartClientState | null {
  if (!cart) return null;
  return {
    ...cart,
    promotion,
    ...recalcTotals(cart.items, promotion),
  };
}

function cartReducer(
  state: CartClientState | null,
  action: OptimisticAction,
): CartClientState {
  const base = withClientTotals(state ?? EMPTY_CART, state?.promotion ?? null)!;

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
      return { ...base, items, ...recalcTotals(items, base.promotion) };
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
      return { ...base, items, ...recalcTotals(items, base.promotion) };
    }
    case "remove": {
      const items = base.items.filter((i) => i.productId !== action.productId);
      return { ...base, items, ...recalcTotals(items, base.promotion) };
    }
    case "clear":
      return {
        ...base,
        items: [],
        ...recalcTotals([], base.promotion),
      };
  }
}

type CartContextState = {
  cart: CartClientState | null;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  applyPromotion: (promotion: Promotion | null) => void;
  promotion: Promotion | null;
};

const CartContext = createContext<CartContextState | null>(null);

export function CartProvider({
  initialCart = null,
  initialPromotion = null,
  children,
}: {
  initialCart?: CartWithProducts | null;
  initialPromotion?: Promotion | null;
  children: ReactNode;
}) {
  const { runCartAction } = useCartTray();
  // manage cart from server in client state, update it with mutations.
  const [cartState, setCart] = useState<CartClientState | null>(
    withClientTotals(initialCart, initialPromotion),
  );
  useEffect(() => {
    setCart((current) =>
      withClientTotals(
        initialCart,
        initialPromotion ?? current?.promotion ?? null,
      ),
    );
  }, [initialCart, initialPromotion]);

  const [cart, applyOptimistic] = useOptimistic<
    CartClientState | null,
    OptimisticAction
  >(cartState, cartReducer);

  const syncServerCart = useCallback((updatedCart: CartWithProducts | null) => {
    if (!updatedCart) return;
    setCart((current) =>
      withClientTotals(updatedCart, current?.promotion ?? null),
    );
  }, []);

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      runCartAction(async () => {
        applyOptimistic({ type: "add", product, quantity });
        const updatedCart = await addToCartAction(product, quantity);
        syncServerCart(updatedCart);
      });
    },
    [runCartAction, applyOptimistic, syncServerCart],
  );

  // Promotion is purely client state (no server roundtrip), so it lives only
  // on the persistent `cartState`. useOptimistic re-derives `cart` from that,
  // so the discount/total flow through to consumers automatically.
  const applyPromotion = useCallback((promotion: Promotion | null) => {
    setCart((current) => {
      const base = current ?? withClientTotals(EMPTY_CART, null)!;
      return {
        ...base,
        promotion,
        ...recalcTotals(base.items, promotion),
      };
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      runCartAction(async () => {
        applyOptimistic({ type: "updateQuantity", productId, quantity });
        const updatedCart = await updateCartQuantityAction(productId, quantity);
        syncServerCart(updatedCart);
      });
    },
    [runCartAction, applyOptimistic, syncServerCart],
  );

  const removeItem = useCallback(
    (productId: string) => {
      runCartAction(async () => {
        applyOptimistic({ type: "remove", productId });
        const updatedCart = await removeFromCartAction(productId);
        syncServerCart(updatedCart);
      });
    },
    [runCartAction, applyOptimistic, syncServerCart],
  );

  const clear = useCallback(() => {
    runCartAction(async () => {
      applyOptimistic({ type: "clear" });
      const updatedCart = await clearCartAction();
      syncServerCart(updatedCart);
    });
  }, [runCartAction, applyOptimistic, syncServerCart]);

  const promotion = cart?.promotion ?? null;

  const value = useMemo(
    () => ({
      cart,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      applyPromotion,
      promotion,
    }),
    [
      cart,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      applyPromotion,
      promotion,
    ],
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
