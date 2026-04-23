import { get } from "./client";
import { cacheLife, cacheTag } from "next/cache";
import type {
  ProductListResponse,
  ProductResponse,
  CategorySlug,
} from "@/app/lib/models";

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: CategorySlug;
  search?: string;
  featured?: boolean;
}

export async function listProducts(params?: ListProductsParams) {
  "use cache";
  cacheLife("products");

  const mapped = params
    ? {
        ...params,
        featured:
          params.featured !== undefined ? String(params.featured) : undefined,
      }
    : undefined;

  const { data } = await get<ProductListResponse>("/products", {
    params: mapped,
  });
  return data;
}

export async function getProduct(id: string) {
  "use cache";
  cacheLife("products");
  cacheTag("products", `product-${id}`);

  const { data } = await get<ProductResponse>(
    `/products/${encodeURIComponent(id)}`,
  );
  return data;
}
