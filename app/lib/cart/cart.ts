// define mutations as server only (use server) so they can be called by client but not bundled
"use server";

import { revalidatePath } from "next/cache";
import {
  getCart,
  addItemToCart,
  createCart as createCartApi,
  updateCartItem,
  removeCartItem,
} from "../api/cart";
import { CartResponse, CartWithProducts, Product } from "../models";
import { getCartIdFromCookie, setCartIdCookie } from "./cookie";

export async function getCurrentCart(): Promise<CartResponse | null> {
  const token = await getCartIdFromCookie();
  if (!token) return null;

  const cart = await getCart(token);
  return cart ?? null;
}

async function ensureCartToken(): Promise<string> {
  const existing = await getCartIdFromCookie();
  if (existing) return existing;

  const created = await createCartApi();
  if (!created?.token) {
    throw new Error("Failed to create cart");
  }
  await setCartIdCookie(created.token);
  return created.token;
}

export async function addToCart(
  product: Product,
  quantity: number,
): Promise<CartWithProducts | null> {
  const token = await ensureCartToken();

  const cart = await addItemToCart(token, {
    productId: product.id,
    quantity,
  });
  if (!cart) {
    throw new Error("Failed to add item to cart");
  }

  revalidatePath("/", "layout");
  return cart.data;
}

export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<CartWithProducts | null> {
  const token = await ensureCartToken();
  const cart = await updateCartItem(token, productId, { quantity });
  if (!cart) {
    throw new Error("Failed to update cart quantity");
  }
  revalidatePath("/", "layout");
  return cart.data;
}

export async function removeFromCart(
  productId: string,
): Promise<CartWithProducts | null> {
  const token = await ensureCartToken();
  const cart = await removeCartItem(token, productId);
  if (!cart) {
    throw new Error("Failed to remove item from cart");
  }
  revalidatePath("/", "layout");
  return cart.data;
}

export async function clearCart(): Promise<boolean> {
  const token = await ensureCartToken();
  const cart = await getCart(token);
  if (cart && cart.data.items.length > 0) {
    for (const item of cart.data.items) {
      await removeCartItem(token, item.productId);
    }
  }
  revalidatePath("/", "layout");
  return true;
}
