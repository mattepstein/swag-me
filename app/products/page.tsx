import { Suspense } from "react";
import { notFound } from "next/navigation";
import { listProducts } from "../lib/api";
import { isCategorySlug } from "../lib/models";
import type { ListProductsParams } from "../lib/api";
import ProductCard from "../ui/product/product-card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category: string;
    search: string;
    featured: string;
    page: string;
    per_page: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const per_page = parseInt(params.per_page || "10");
  const category =
    params.category && isCategorySlug(params.category)
      ? params.category
      : undefined;

  const search = params.search;
  const featured = params.featured === "true" ? true : undefined;
  const parsedParams = { page, limit: per_page, category, search, featured };

  return (
    <main>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: per_page }, (_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          }
        >
          <ProductGrid params={parsedParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function ProductGrid({ params }: { params: ListProductsParams }) {
  const products = await listProducts(params);
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
