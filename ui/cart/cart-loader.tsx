"use client";

import { useEffect } from "react";
import { useCartData } from "@/lib/cart/cart-data-context";
import type { CartWithProducts } from "@/lib/models/cart";

export default function CartLoader({
  initialCart,
}: {
  initialCart: CartWithProducts | null;
}) {
  const { syncCart } = useCartData();

  useEffect(() => {
    syncCart(initialCart);
  }, [initialCart, syncCart]);

  return null;
}
