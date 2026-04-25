import type { CartItemWithProduct, CartWithProducts } from "../models/cart";

export function calculateCartTotals(cart: CartWithProducts) {
  const subtotalAmount =
    cart?.items?.reduce((sum, line) => sum + line.lineTotal, 0) || 0;

  const discountTotal = 0;
  const shippingTotal = 0;
  const taxTotal = 0;

  const grandTotal = subtotalAmount - discountTotal + shippingTotal + taxTotal;

  return {
    subtotal: subtotalAmount,
    discountTotal,
    shippingTotal,
    taxTotal,
    grandTotal,
    itemCount: cart?.items?.reduce((sum, line) => sum + line.quantity, 0),
  };
}
