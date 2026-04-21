import { notFound } from "next/navigation";
import { listProducts } from "../../lib/api";
import { isCategorySlug } from "../../lib/models";
import ProductCard from "./product-card";
import { ProductSearchParams } from "@/app/lib/models/product";

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
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.per_page || "10");
  const category =
    params.category && isCategorySlug(params.category)
      ? params.category
      : undefined;
  const search = params.search;
  const featured = params.featured === "true" ? true : undefined;

  const products = await listProducts({
    page,
    limit,
    category,
    search,
    featured,
  });
  if (!products) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
