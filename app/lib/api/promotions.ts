import "server-only";
import { get } from "./client";
import type { PromotionResponse } from "@/app/lib/models";

export async function getActivePromotion() {
  const { data } = await get<PromotionResponse>("/promotions");
  return data;
}
