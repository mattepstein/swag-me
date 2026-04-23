"use client";

import { Suspense, useState } from "react";
import { Category } from "@/app/lib/models/category";
import {
  CategoryList,
  CategoryListSkeleton,
} from "../navigation/category-list";
import { useSearchParams } from "next/navigation";

export function LeftRailSkeleton() {
  return (
    <aside className="relative z-10 flex shrink-0 flex-col border-r border-white/10 bg-zinc-900 text-white transition-[width] duration-200 ease-out w-10 sm:w-11">
      <div className="h-11 w-full animate-pulse bg-gray-200" />
    </aside>
  );
}

export default function LeftRail({
  categoryList,
}: {
  categoryList: Category[];
}) {
  const [isOpen, setIsOpen] = useState(true);
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  return (
    <aside
      className={`relative z-10 flex shrink-0 flex-col border-r border-white/10 bg-zinc-900 text-white transition-[width] duration-200 ease-out ${
        isOpen ? "w-52 sm:w-56" : "w-10 sm:w-11"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        className="flex h-11 w-full shrink-0 items-center justify-center border-b border-white/10 text-sm font-mono tracking-tighter hover:bg-white/10"
      >
        {isOpen ? "<<" : ">>"}
      </button>
      {isOpen && (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 text-sm">
          <Suspense fallback={<CategoryListSkeleton count={10} />}>
            <CategoryList
              categoryList={categoryList}
              currentCategory={currentCategory}
            />
          </Suspense>
        </div>
      )}
    </aside>
  );
}
