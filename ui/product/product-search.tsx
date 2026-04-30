import { Suspense } from "react";
import { ProductGridData, ProductGridSkeleton } from "./product-grid";
import { ProductSearchParams } from "../../lib/models/product";
import { isCategorySlug } from "../../lib/models/category";

export function ProductSearchSkeleton() {
  return <ProductGridSkeleton showPagination={true} count={10} />;
}

async function ProductsGridFromSearchParams({
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
  const tag = params.tag;
  const search = params.search;
  const featured = params.featured === "true" ? true : undefined;

  return (
    <Suspense
      key={`${page}-${limit}-${category ?? ""}-${tag ?? ""}-${search ?? ""}-${featured ?? ""}`}
      fallback={<ProductGridSkeleton showPagination={true} count={limit} />}
    >
      <ProductGridData
        page={page}
        limit={limit}
        category={category}
        tag={tag}
        search={search}
        featured={featured}
        showPagination={true}
      />
    </Suspense>
  );
}

export default function ProductSearchPage({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  return (
    <Suspense fallback={<ProductSearchSkeleton />}>
      <ProductsGridFromSearchParams searchParams={searchParams} />
    </Suspense>
  );
}
