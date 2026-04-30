import "server-only";
import { get } from "./client";
import type { PromotionResponse } from "@/lib/models";
import { cacheLife } from "next/cache";
export async function getActivePromotion() {
  "use cache: remote";
  cacheLife("promotions");
  const { data } = await get<PromotionResponse>("/promotions");
  return data;
}
