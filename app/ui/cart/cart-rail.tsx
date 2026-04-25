import type { ReactNode } from "react";
import { getCurrentCart } from "@/app/lib/cart/cart";
import { CartDataProvider } from "../../lib/cart/cart-context";

export default async function CartDataHost({
  children,
}: {
  children: ReactNode;
}) {
  const cart = await getCurrentCart();
  return (
    <CartDataProvider initialCart={cart?.data ?? null}>
      {children}
    </CartDataProvider>
  );
}
