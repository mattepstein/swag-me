import { Suspense } from "react";
import {
  ProductGridData,
  ProductGridSkeleton,
} from "../product/product-grid";

export default function FeaturedProducts() {
  return (
    <div className="flex flex-col gap-4 mt-16 items-center justify-center ">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <Suspense
        fallback={<ProductGridSkeleton showPagination={false} count={6} />}
      >
        <ProductGridData
          page={1}
          limit={6}
          featured={true}
          showPagination={false}
        />
      </Suspense>
    </div>
  );
}
