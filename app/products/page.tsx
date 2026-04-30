import { Suspense } from "react";
import { ProductSearchParams } from "../../lib/models/product";
import Products, { ProductsSkeleton } from "../../ui/product/products-page";
export default async function Page({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductsSkeleton />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
