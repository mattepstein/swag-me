import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/lib/models";
import { Suspense } from "react";
import StockStatus, {
  ProductStockSkeleton,
} from "@/app/ui/product/stock-status";
import { TagList } from "./taglist";

export function ProductCardSkeleton() {
  return (
    <div className="h-64 w-100 animate-pulse rounded-lg bg-gray-200">
      <div className="card-body">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="text-lg font-bold"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className={clsx(
        "card",

        "border",
        "border-gray-200",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
        "p-2",
        "bg-white",
        "text-black",
      )}
    >
      <div className="card-body">
        <Link href={`/products/${product.id}`}>
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-lg font-bold ">{product.name}</div>

            <Image
              src={product.images[0]}
              alt={product.name}
              width={100}
              height={100}
              loading="eager"
              quality={90}
              className="object-cover"
            />

            <p className="text-sm text-gray-500">${product.price / 100}</p>
            <Suspense fallback={<ProductStockSkeleton />}>
              <StockStatus productId={product.id} />
            </Suspense>
          </div>
        </Link>
        <TagList tags={product.tags} />
      </div>
    </div>
  );
}
