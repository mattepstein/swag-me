import { CartWithProducts } from "@/app/lib/models/cart";
import { Suspense } from "react";

export default function CartIcon({ cart }: { cart: CartWithProducts }) {
  return (
    <div>
      <Suspense fallback={<div>Cart</div>}>
        <h1>Cart {cart?.totalItems || ""}</h1>
      </Suspense>
    </div>
  );
}
