import { getProduct, listProducts } from "@/app/lib/api";
import ImageCarousel from "@/app/ui/product/image-carousel";
import StockStatus from "@/app/ui/product/stock-status";
import AddToCartButton from "@/app/ui/product/add-to-cart-button";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TagList } from "./taglist";

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
    </div>
  );
}

export default async function ProductDetail({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product?.data) {
    return notFound();
  }

  return (
    <>
      <div className="text-2xl font-bold">{product.data.name}</div>
      <TagList tags={product?.data?.tags} />
      <div className="flex flex-col gap-2 items-start justify-start">
        <p className="text-gray-500">${product.data.price / 100}</p>
        <Suspense fallback={<div>Loading stock…</div>}>
          <StockStatus productId={product.data.id} />
        </Suspense>
      </div>

      <AddToCartButton product={product.data} />
      <ImageCarousel images={product.data.images} />
      <p className="text-gray-500">{product.data.description}</p>
    </>
  );
}
