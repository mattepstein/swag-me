import { getProduct } from "@/app/lib/api";
import ImageCarousel from "@/app/ui/product/image-carousel";
import StockStatus, {
  ProductStockSkeleton,
} from "@/app/ui/product/stock-status";
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
