import { get } from "./client";

import { cacheLife } from "next/cache";
import type { StockResponse } from "@/app/lib/models";

export async function getProductStock(idOrSlug: string) {
  "use cache";
  cacheLife("stock");
  const { data } = await get<StockResponse>(
    `/products/${encodeURIComponent(idOrSlug)}/stock`,
  );
  return data;
}
