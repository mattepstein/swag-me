import { listCategories } from "@/app/lib/api";
import { Category } from "@/app/lib/models/category";
import clsx from "clsx";
import Link from "next/link";
import { Suspense } from "react";

export function CategoryListSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
      ))}
    </>
  );
}
export function CategoryList({ categoryList }: { categoryList: Category[] }) {
  const linkClass = clsx("rounded-md px-2 py-1.5 hover:bg-white/10");
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 text-sm">
      <Link href="/" className={linkClass}>
        Home
      </Link>
      <Link href="/products" className={linkClass}>
        All products
      </Link>
      <div className="text-sm px-2 py-1.5 underline font-medium">
        Categories
      </div>
      <div className="ml-2 flex flex-col gap-1">
        <Suspense fallback={<CategoryListSkeleton count={10} />}>
          {categoryList?.length > 0 &&
            categoryList?.map((category) => (
              <Link
                href={`/products?category=${category.slug}`}
                className={linkClass}
                key={category.slug}
              >
                {category.name} ({category.productCount})
              </Link>
            ))}
        </Suspense>
      </div>
    </nav>
  );
}
