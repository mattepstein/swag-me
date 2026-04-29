import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "swag_cart";

export async function getCartIdFromCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
export async function deleteCartIdCookie(): Promise<void> {
  const store = await cookies();
  // Match attributes used in setCartIdCookie so the browser clears the same cookie.
  store.delete({
    name: COOKIE_NAME,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function setCartIdCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
