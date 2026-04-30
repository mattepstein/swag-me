import { getCurrentCart } from "@/lib/cart/cart-mutations";
import CartLoader from "./cart-loader";

export default async function CartDataLoader() {
  const cartRes = await getCurrentCart();
  const initialCart = cartRes?.success === true ? cartRes.data : null;

  return <CartLoader initialCart={initialCart} />;
}
