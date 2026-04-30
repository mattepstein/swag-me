// cart mutations are defined as server only (use server) so they can be called by client but not bundled
// cart is shown on left rail of layout so all mutations revalidate / path.
"use server";

import { revalidatePath } from "next/cache";
import {
  getCart,
  addItemToCart,
  createCart as createCartApi,
  updateCartItem,
  removeCartItem,
} from "../api/cart";
import {
  type ApiSuccessResponse,
  CartResponse,
  CartWithProducts,
  Product,
} from "../models";

import {
  getCartIdFromCookie,
  setCartIdCookie,
  deleteCartIdCookie,
} from "./cookie";

/**
 * Read-only load cart from for server components. never sets or deletes cookies
 */
export async function getCurrentCart(): Promise<CartResponse | null> {
  const token = await getCartIdFromCookie();
  if (!token) return null;

  try {
    return await getCart(token);
  } catch {
    return null;
  }
}

/**
 * Ensures the cookie points at a live cart and returns the latest server snapshot.
 * Rotates the cart token if GET /cart fails (e.g. expired token).
 */
async function refreshValidatedCart(): Promise<{
  token: string;
  response: ApiSuccessResponse<CartWithProducts>;
}> {
  let token = await ensureCartToken();
  try {
    const response = (await getCart(
      token,
    )) as ApiSuccessResponse<CartWithProducts>;
    return { token, response };
  } catch (firstError) {
    token = await ensureCartToken(true);
    try {
      const response = (await getCart(
        token,
      )) as ApiSuccessResponse<CartWithProducts>;
      return { token, response };
    } catch (secondError) {
      throw new AggregateError(
        [firstError, secondError],
        "Cart could not be loaded after refreshing the session. Try again.",
      );
    }
  }
}

/**
 * Ensures the cart token is valid and returns the token.
 * If the cart token is not valid, creates a new cart then updates the cookie
 * __forceCreate__ is true, the cookie is cleared and a new cart is created
 *
 */
async function ensureCartToken(forceCreate: boolean = false): Promise<string> {
  //clear the cookie if forcing a new cart
  if (forceCreate) {
    await deleteCartIdCookie();
  } else {
    //get the existing cart token from the cookie
    const existing = await getCartIdFromCookie();
    if (existing) {
      return existing;
    }
  }

  //if no existing cart token, create a new one
  const created = await createCartApi();
  if (!created?.token) {
    throw new Error("Failed to create cart");
  }
  //set the new cart token in the cookie
  await setCartIdCookie(created.token);
  return created.token;
}

/** Refresh the cart from the server then
 * add item to the cart or update the quantity if the item already exists */
export async function addToCart(
  product: Product,
  quantity: number,
): Promise<CartWithProducts | null> {
  const { token, response } = await refreshValidatedCart();
  const existing = response.data.items.find((i) => i.productId === product.id);

  const cart = (
    existing
      ? await updateCartItem(token, product.id, {
          quantity: existing.quantity + quantity,
        })
      : await addItemToCart(token, {
          productId: product.id,
          quantity,
        })
  ) as ApiSuccessResponse<CartWithProducts>;

  revalidatePath("/", "layout");
  return cart.data;
}

/** Refresh the cart from the server then update the quantity
 *  of an item in the cart, add it if it doesn't exist or remove the item if the quantity is 0 */
export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<CartWithProducts | null> {
  const { token, response } = await refreshValidatedCart();
  const hasLine = response.data.items.some((i) => i.productId === productId);

  let cart: ApiSuccessResponse<CartWithProducts>;
  if (quantity <= 0) {
    cart = hasLine
      ? ((await removeCartItem(
          token,
          productId,
        )) as ApiSuccessResponse<CartWithProducts>)
      : response;
  } else if (hasLine) {
    cart = (await updateCartItem(token, productId, {
      quantity,
    })) as ApiSuccessResponse<CartWithProducts>;
  } else {
    // New cart after token rotation (or client/server desync): line missing, add instead of PATCH.
    cart = (await addItemToCart(token, {
      productId,
      quantity,
    })) as ApiSuccessResponse<CartWithProducts>;
  }

  revalidatePath("/", "layout");
  return cart.data;
}

/** Refresh the cart from the server then remove the item from the cart */
export async function removeFromCart(
  productId: string,
): Promise<CartWithProducts | null> {
  const { token, response } = await refreshValidatedCart();
  const hasLine = response.data.items.some((i) => i.productId === productId);

  const cart: ApiSuccessResponse<CartWithProducts> = hasLine
    ? ((await removeCartItem(
        token,
        productId,
      )) as ApiSuccessResponse<CartWithProducts>)
    : response;

  revalidatePath("/", "layout");
  return cart.data;
}

/** Refresh the cart from the server then clear the cart by cycling through and removing all items*/
export async function clearCart(): Promise<CartWithProducts | null> {
  const { token, response } = await refreshValidatedCart();
  if (response.data.items.length === 0) {
    revalidatePath("/", "layout");
    return response.data;
  }

  let last: ApiSuccessResponse<CartWithProducts> = response;
  for (const item of response.data.items) {
    last = (await removeCartItem(
      token,
      item.productId,
    )) as ApiSuccessResponse<CartWithProducts>;
  }
  revalidatePath("/", "layout");
  return last.data;
}