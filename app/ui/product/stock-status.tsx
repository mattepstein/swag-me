import { getProductStock } from "@/app/lib/api";
import { clsx } from "clsx";

export function ProductStockSkeleton() {
  return <div className="h-4 w-full animate-pulse rounded bg-gray-200" />;
}

export default async function StockStatus({
  productId,
}: {
  productId: string;
}) {
  const stock = await getProductStock(productId);
  if (!stock?.data || stock.data.stock === 0) {
    return (
      <div>
        <p>Out of Stock</p>
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "text-sm text-gray-500",
        stock.data.lowStock && "text-yellow-500",
        stock.data.stock === 0 && "text-red-500",
      )}
    >
      <p>{stock.data.stock} in Stock</p>
      {stock.data.lowStock && <p>Low Stock</p>}
    </div>
  );
}
