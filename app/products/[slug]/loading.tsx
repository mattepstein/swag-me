import { ProductDetailSkeleton } from "@/ui/product/product-detail";

export default function Loading() {
  return (
    <main className="container mx-0 px-4 py-8">
      <ProductDetailSkeleton />
    </main>
  );
}
