import { ProductsSkeleton } from "@/ui/product/products-page";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <ProductsSkeleton />
    </main>
  );
}
