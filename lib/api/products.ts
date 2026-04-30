import "server-only";
import { get } from "./client";
import { cacheLife, cacheTag } from "next/cache";
import type {
  ProductListResponse,
  ProductResponse,
  CategorySlug,
} from "@/lib/models";

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: CategorySlug;
  tag?: string;
  search?: string;
  featured?: boolean;
}

function mapListProductsParams(params?: ListProductsParams) {
  if (!params) return undefined;

  const { tag, search, featured, ...rest } = params;

  return {
    ...rest,
    search: search || tag,
    featured: featured !== undefined ? String(featured) : undefined,
  };
}

export async function listProducts(params?: ListProductsParams) {
  "use cache: remote";
  cacheLife("products");

  const mapped = mapListProductsParams(params);
  try {
    const { data } = await get<ProductListResponse>("/products", {
      params: mapped,
    });
    return data;
  } catch (error) {
    return {
      data: [],
      meta: {
        total: 0,
      },
    };
  }
}

export async function getProduct(id: string) {
  "use cache: remote";
  cacheLife("products");
  cacheTag("products", `product-${id}`);
  try {
    const { data } = await get<ProductResponse>(
      `/products/${encodeURIComponent(id)}`,
    );
    return data;
  } catch (error) {
    return null;
  }
}
