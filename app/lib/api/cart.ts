import "server-only";
import { get, post, patch, del } from "./client";
import type {
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "@/app/lib/models";

function cartHeaders(token: string): HeadersInit {
  return { "x-cart-token": token };
}

/** Creates a new empty cart. Returns the cart data and the token for subsequent requests. */
export async function createCart() {
  const { data, headers } = await post<CartResponse>("/cart/create");
  const token = headers.get("x-cart-token")!;
  return { ...data, token };
}
/** Gets the existing cart or throws an error if the cart is not found */
export async function getCart(token: string) {
  try {
    const { data } = await get<CartResponse>("/cart", {
      headers: cartHeaders(token),
    });
    return data;
  } catch (error) {
    throw new Error("getCart api error: " + error);
  }
}

/** Adds an item to the cart. may throw an error if the cart is not found */
export async function addItemToCart(token: string, body: AddToCartRequest) {
  const { data } = await post<CartResponse>("/cart", {
    headers: {
      ...cartHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return data;
}
/** Updates an item in the cart. may throw an error if the cart is not found */
export async function updateCartItem(
  token: string,
  itemId: string,
  body: UpdateCartItemRequest,
) {
  const { data } = await patch<CartResponse>(
    `/cart/${encodeURIComponent(itemId)}`,
    {
      headers: {
        ...cartHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  return data;
}

/** Removes an item from the cart. may throw an error if the cart is not found */
export async function removeCartItem(token: string, itemId: string) {
  const { data } = await del<CartResponse>(
    `/cart/${encodeURIComponent(itemId)}`,
    {
      headers: cartHeaders(token),
    },
  );
  return data;
}
