import { Suspense } from "react";
import ProductGrid, { ProductGridSkeleton } from "../product/product-grid";

export default async function FeaturedProducts() {
  const searchParams = {
    featured: "true",
    page: "1",
    per_page: "10",
  };
  return (
    <div className="flex flex-col gap-4 mt-16 items-center justify-center ">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <Suspense fallback={<ProductGridSkeleton count={10} />}>
        <ProductGrid searchParams={Promise.resolve(searchParams)} />
      </Suspense>
    </div>
  );
}
