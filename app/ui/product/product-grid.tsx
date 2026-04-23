import { ProductListResponse } from "@/app/lib/models";
import ProductCard from "./product-card";
import Pagination from "./pagination";
import ProductNotFoundCard from "./product-not-found";

export function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
      ))}
    </div>
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
      {showPagination && products?.meta?.pagination?.totalPages > 1 && (
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
