import type { Product } from "./product";

export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
  /** price * quantity in cents */
  lineTotal: number;
}

export interface CartWithProducts {
  token: string;
  items: CartItemWithProduct[];
  totalItems: number;
  /** Total in cents */
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  /** @default 1 */
  quantity?: number;
}

export interface UpdateCartItemRequest {
  /** Set to 0 to remove the item */
  quantity: number;
}
