"use client";

import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-white/10 bg-zinc-600 p-4 text-white shadow-xl">
          <nav aria-label="Main menu" className="flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
