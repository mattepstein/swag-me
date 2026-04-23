import { Suspense } from "react";
import ProductGrid, { ProductGridSkeleton } from "./product-grid";
import { ProductSearchParams } from "../../lib/models/product";
import Searchbar, { SearchbarSkeleton } from "../../ui/header/searchbar";
import { isCategorySlug } from "../../lib/models/category";
import { listProducts } from "../../lib/api";

export function ProductsSkeleton() {
  return (
    <>
      <SearchbarSkeleton />
      <ProductGridSkeleton count={10} />
    </>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.per_page || "10");
  const category =
    params.category && isCategorySlug(params.category)
      ? params.category
      : undefined;
  const search = params.search;
  const featured = params.featured === "true" ? true : undefined;

  const products = await listProducts({
    page,
    limit,
    category,
    search,
    featured,
  });
  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <Suspense fallback={<SearchbarSkeleton />}>
          <Searchbar placeholder="Search products" />
        </Suspense>
      </div>
      <Suspense fallback={<ProductGridSkeleton count={10} />}>
        <ProductGrid products={products} showPagination={true} />
      </Suspense>
    </>
  );
}
