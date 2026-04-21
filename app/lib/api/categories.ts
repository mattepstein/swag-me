import { get } from "./client";
import type { CategoryListResponse } from "@/app/lib/models";

export async function listCategories() {
  const { data } = await get<CategoryListResponse>("/categories");
  return data;
}
