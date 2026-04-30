import { CategorySlug, ProductListResponse } from "@/lib/models";
import ProductCard, { ProductCardSkeleton } from "./product-card";
import Pagination, { PaginationSkeleton } from "./pagination";
import ProductNotFoundCard from "./product-not-found";
import { listProducts } from "@/lib/api";

export async function ProductGridData({
  page,
  limit,
  category,
  tag,
  search,
  featured,
  showPagination = false,
}: {
  page: number;
  limit: number;
  category?: CategorySlug | undefined;
  tag?: string;
  search?: string;
  featured?: boolean;
  showPagination?: boolean;
}) {
  const products = await listProducts({
    page,
    limit,
    category,
    tag,
    search,
    featured,
  });
  return <ProductGrid products={products} showPagination={showPagination} />;
}

export function ProductGridSkeleton({
  count,
  showPagination = false,
}: {
  count: number;
  showPagination: boolean;
}) {
  return (
    <>
      {showPagination === true && (
        <div className="flex justify-center items-center mb-4 w-full">
          <PaginationSkeleton />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

export default async function ProductGrid({
  products,
  showPagination = false,
}: {
  products?: ProductListResponse;
  showPagination?: boolean;
}) {
  if (!products || products.data.length === 0) {
    //return a placeholder not found product
    return (
      <div className="grid grid-cols-1  gap-4">
        <ProductNotFoundCard />
      </div>
    );
  }
  return (
    <>
      {showPagination === true &&
        products?.meta?.pagination?.totalPages > 1 && (
          <div className="flex justify-center items-center mb-4 w-full">
            <Pagination
              totalPages={products?.meta?.pagination?.totalPages || 1}
            />
          </div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
