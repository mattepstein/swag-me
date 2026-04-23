import { Suspense } from "react";
import ProductGrid, { ProductGridSkeleton } from "../product/product-grid";
import { listProducts, ListProductsParams } from "@/app/lib/api";

export default async function FeaturedProducts() {
  const searchParams: ListProductsParams = {
    featured: true,
    page: 1,
    limit: 6,
  };
  const products = await listProducts(searchParams);

  return (
    <div className="flex flex-col gap-4 mt-16 items-center justify-center ">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <Suspense fallback={<ProductGridSkeleton count={6} />}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  );
}
