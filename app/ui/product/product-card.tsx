import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/lib/models";
import { Suspense } from "react";
import StockStatus from "@/app/ui/product/stock-status";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className={clsx(
        "card",
        "bg-white",
        "border",
        "border-gray-200",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden",
      )}
    >
      <div className="card-body">
        <Link href={`/products/${product.id}`}>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={100}
            height={100}
          />

          <p className="text-sm text-gray-500">${product.price / 100}</p>
          <Suspense fallback={<div>Loading...</div>}>
            <StockStatus productId={product.id} />
          </Suspense>
        </Link>
      </div>
    </div>
  );
}
