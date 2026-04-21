import { get } from "./client";
import type { PromotionResponse } from "@/app/lib/models";

/** Returns a randomly selected active promotional banner. May differ per request. */
export async function getActivePromotion() {
  const { data } = await get<PromotionResponse>("/promotions");
  return data;
}
