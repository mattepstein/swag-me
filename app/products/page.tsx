import { Suspense } from "react";
import ProductGrid, { ProductGridSkeleton } from "../ui/product/product-grid";
import { ProductSearchParams } from "../lib/models/product";

export default function Page({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  return (
    <main>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<ProductGridSkeleton count={10} />}>
          <ProductGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
