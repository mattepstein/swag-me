"use client";

import clsx from "clsx";
import { useCartTray } from "../../lib/cart/cart-tray-context";
import { useCartData } from "../../lib/cart/cart-data-context";

function TrayOverlay() {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/60 backdrop-blur-[1px]"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span className="sr-only">Updating cart…</span>
    </div>
  );
}

export default function CartTray() {
  const { isPending } = useCartTray();
  const { cart, updateQuantity, removeItem, clear } = useCartData();
  const checkout = () => {
    alert("Checkout not implemented");
  };
  const isEmpty = !cart || (cart.items?.length ?? 0) === 0;

  return (
    <div
      className={clsx(
        "relative flex min-h-0 flex-1 flex-col overflow-y-auto p-3 text-sm transition-opacity",
        isPending && "opacity-60",
      )}
    >
      {isEmpty ? (
        <p className="mt-6">
          {isPending ? "Adding to cart…" : "Your cart is empty."}
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          <ul className="space-y-4">
            {cart!.items.map((line) => (
              <li key={line.product.id} className="rounded border p-4">
                <div className="flex-col flex-row items-start justify-between gap-4">
                  <div>
                    <div className="font-medium py-2">{line.product.name}</div>
                    <div className="text-sm py-2 text-right">
                      ${(line.lineTotal / 100).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          line.productId,
                          Math.max(0, line.quantity - 1),
                        )
                      }
                      className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                      -
                    </button>

                    <span>{line.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(line.productId, line.quantity + 1)
                      }
                      className="rounded border px-3 py-1 disabled:opacity-50"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(line.productId)}
                      className="ml-4 text-sm underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded border p-4">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cart!.totalItems}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Subtotal</span>
              <span>${(cart!.subtotal / 100).toFixed(2)}</span>
            </div>
            {cart!.promotion && cart!.discount > 0 ? (
              <div className="mt-2 flex justify-between text-emerald-300">
                <span>{cart!.promotion.code}</span>
                <span>-${(cart!.discount / 100).toFixed(2)}</span>
              </div>
            ) : null}
            <div className="mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${(cart!.total / 100).toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={() => clear()}
              className="mt-4 rounded border px-4 py-2 disabled:opacity-50"
            >
              Clear cart
            </button>
          </div>
          <div className=" flex justify-center p-1">
            <button
              type="button"
              onClick={() => checkout()}
              className="mt-1 rounded border px-6 py-2 "
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {isPending && <TrayOverlay />}
    </div>
  );
}
