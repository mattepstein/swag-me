import { Suspense } from "react";
import { ProductSearchParams } from "../../lib/models/product";
import ProductSearch, {
  ProductSearchSkeleton,
} from "../../ui/product/product-search";
import {
  SearchbarComponent,
  SearchSkeleton,
} from "@/ui/product/searchbar-componenet";
export default function Page({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  return (
    <>
      <div className="md:col-span-3  sm:col-span-1 bg-gray-100  ">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchbarComponent placeholder="Search products" />
        </Suspense>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductSearchSkeleton />}>
          <ProductSearch searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
