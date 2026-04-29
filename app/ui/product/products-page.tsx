import { Suspense } from "react";
import ProductGrid, {
  ProductGridData,
  ProductGridSkeleton,
} from "./product-grid";
import { ProductSearchParams } from "../../lib/models/product";
import { isCategorySlug, CategorySlug } from "../../lib/models/category";
import { listProducts } from "../../lib/api";

export function ProductsSkeleton() {
  return <ProductGridSkeleton showPagination={true} count={10} />;
}

export default async function ProductsPage({
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

  return (
    <Suspense
      key={`${page}-${limit}-${category ?? ""}-${search ?? ""}-${featured ?? ""}`}
      fallback={<ProductGridSkeleton showPagination={true} count={limit} />}
    >
      <ProductGridData
        page={page}
        limit={limit}
        category={category}
        search={search}
        featured={featured}
        showPagination={true}
      />
    </Suspense>
  );
}
