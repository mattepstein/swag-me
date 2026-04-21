import { get } from "./client";
import { cacheLife } from "next/cache";
import type { ApiSuccessResponse } from "@/app/lib/models";

export interface StoreFeatures {
  wishlist: boolean;
  productComparison: boolean;
  reviews: boolean;
  liveChat: boolean;
  recentlyViewed: boolean;
}

export interface StoreSocialLinks {
  twitter: string;
  github: string;
  discord: string;
}

export interface StoreSeo {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
}

export interface StoreConfig {
  storeName: string;
  currency: string;
  features: StoreFeatures;
  socialLinks: StoreSocialLinks;
  seo: StoreSeo;
}

export async function getStoreConfig() {
  "use cache";
  cacheLife("storeConfig");
  const { data } = await get<ApiSuccessResponse<StoreConfig>>("/store/config");
  return data;
}
