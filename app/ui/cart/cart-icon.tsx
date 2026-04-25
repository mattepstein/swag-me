"use client";

import { useCartData } from "../../lib/cart/cart-context";

export default function CartIcon() {
  const { cart } = useCartData();
  const count = cart?.totalItems ?? 0;
  return (
    <div>
      <h1>Cart {count > 0 ? count : ""}</h1>
    </div>
  );
}
