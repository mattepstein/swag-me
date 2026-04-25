"use client";
import clsx from "clsx";
import { Product } from "../../lib/models/product";
import { useCartUI } from "../cart/cart-ui-context";
import { useCartData } from "../../lib/cart/cart-context";

export default function AddToCartButton({ product }: { product: Product }) {
  const { open, isPending } = useCartUI();
  const { addItem } = useCartData();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        open();
        addItem(product, 1);
      }}
      className={clsx(
        "rounded bg-black px-4 py-2 text-white disabled:opacity-50",
        { "opacity-50 cursor-not-allowed": isPending },
      )}
    >
      {isPending ? "Adding…" : "Add to cart"}
    </button>
  );
}
