import "server-only";
import { get } from "./client";
import { cacheLife } from "next/cache";
import type { StockResponse } from "@/lib/models";

export async function getProductStock(idOrSlug: string) {
  "use cache: remote";
  cacheLife("stock");
  const { data } = await get<StockResponse>(
    `/products/${encodeURIComponent(idOrSlug)}/stock`,
  );
  return data;
}
