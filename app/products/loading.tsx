import { ProductSearchSkeleton } from "@/ui/product/product-search";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ProductSearchSkeleton />
    </main>
  );
}
