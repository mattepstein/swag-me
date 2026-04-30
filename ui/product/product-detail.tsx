import { getProduct } from "@/lib/api";
import ImageCarousel from "@/ui/product/image-carousel";
import StockStatus, { ProductStockSkeleton } from "@/ui/product/stock-status";
import AddToCartButton from "@/ui/product/add-to-cart-button";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TagList } from "./taglist";

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200" />
        <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200" />
        <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="h-9 w-3/4 max-w-md animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-11 w-44 animate-pulse rounded-md bg-gray-200" />
        </div>
        <div className="col-span-1 md:col-span-1">
          <div className="aspect-square w-full max-w-lg animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product?.data) {
    return notFound();
  }

  return (
    <>
      <TagList tags={product?.data?.tags} />
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <div className="col-span-1  ">
          <div className="text-2xl font-bold">{product.data.name}</div>

          <p className="text-gray-500">${product.data.price / 100}</p>
          <Suspense fallback={<ProductStockSkeleton />}>
            <StockStatus productId={product.data.id} />
          </Suspense>

          <p className="text-gray-500">{product.data.description}</p>

          <AddToCartButton product={product.data} />
        </div>
        <div className="col-span-1">
          <ImageCarousel images={product.data.images} />
        </div>
      </div>
    </>
  );
}
