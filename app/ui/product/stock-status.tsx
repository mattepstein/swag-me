import { getProductStock } from "@/app/lib/api";
import { clsx } from "clsx";
import { cacheLife } from "next/cache";

export function ProductStockSkeleton() {
  return <div className="h-4 w-full animate-pulse rounded bg-gray-200" />;
}

export default async function StockStatus({
  productId,
}: {
  productId: string;
}) {
  "use cache";
  cacheLife("stock");
  const stock = await getProductStock(productId);
  const isOutOfStock =
    !stock?.data || stock.data.stock === null || stock.data.stock < 1;

  return (
    <div
      className={clsx("text-sm text-gray-500", {
        "text-yellow-500": stock?.data?.lowStock,
        "text-red-500": isOutOfStock,
      })}
    >
      <p>{isOutOfStock ? "Out of Stock" : `${stock.data.stock} in Stock`}</p>
    </div>
  );
}
