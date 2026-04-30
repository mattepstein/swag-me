import type { ReactNode } from "react";
import { getCurrentCart } from "@/lib/cart/cart-mutations";
import type { CartWithProducts } from "@/lib/models/cart";
import { CartProvider } from "../../lib/cart/cart-data-context";

export default async function CartDataHost({
  children,
}: {
  children: ReactNode;
}) {
  const cartRes = await getCurrentCart();
  const initial: CartWithProducts | null =
    cartRes?.success === true ? cartRes.data : null;
  return (
    <CartProvider key={initial?.token ?? "no-cart"} initialCart={initial}>
      {children}
    </CartProvider>
  );
}
