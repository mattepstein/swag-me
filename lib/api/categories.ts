import "server-only";
import { cacheLife } from "next/cache";
import { get } from "./client";
import type { CategoryListResponse } from "@/lib/models";

export async function listCategories() {
  "use cache: remote";
  cacheLife("categories");
  const { data } = await get<CategoryListResponse>("/categories");
  return data;
}
