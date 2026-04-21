import type { Product } from "./product";
import type { StockInfo } from "./stock";
import type { Category } from "./category";
import type { Promotion } from "./promotion";
import type { CartWithProducts } from "./cart";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedApiResponse<T> {
  success: true;
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ProductListResponse = PaginatedApiResponse<Product>;
export type ProductResponse = ApiSuccessResponse<Product>;
export type StockResponse = ApiSuccessResponse<StockInfo>;
export type CategoryListResponse = ApiSuccessResponse<Category[]>;
export type PromotionResponse = ApiSuccessResponse<Promotion>;
export type CartResponse = ApiSuccessResponse<CartWithProducts>;
