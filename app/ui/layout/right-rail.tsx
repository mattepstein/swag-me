"use client";

import clsx from "clsx";
import CartTray from "../cart/cart-tray";
import CartIcon from "../cart/cart-icon";
import { useCartTray } from "../../lib/cart/cart-tray-context";

export default function RightRail() {
  const { isOpen, toggle } = useCartTray();

  return (
    <aside
      className={clsx(
        "absolute right-0 top-0 bottom-0 z-30 flex max-h-full flex-col overflow-hidden transition-[width,box-shadow,background-color,border-color] duration-200 ease-out",
        isOpen
          ? "pointer-events-auto w-56 border-l border-white/10 bg-zinc-900 text-white shadow-[-16px_0_32px_-12px_rgba(0,0,0,0.45)] sm:w-64"
          : "pointer-events-none w-18 bg-transparent sm:w-18",
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close tray" : "Open tray"}
        className={clsx(
          "pointer-events-auto flex h-11 w-full shrink-0 items-center justify-center border border-white/25 bg-zinc-900 text-sm font-mono tracking-tighter text-white shadow-md transition-colors hover:bg-zinc-800",
          isOpen ? "rounded-none border-b border-white/10" : "rounded-l-md",
        )}
      >
        <div className="mx-1 px-1">{isOpen ? ">>" : "<<"}</div>
        <CartIcon />
      </button>
      {isOpen && <CartTray />}
    </aside>
  );
}
