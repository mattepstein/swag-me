import { CartWithProducts } from "@/app/lib/models/cart";
export function CartTraySkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 text-sm">
      <p className="font-semibold text-white/90">Cart</p>
      <p className="text-white/70"> Total items: ... </p>
      <p className="text-white/70"> Total price: ... </p>
      <button className="btn btn-primary disabled:opacity-50"> Checkout</button>
    </div>
  );
}

export default function CartTray({ cart }: { cart: CartWithProducts }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 text-sm">
      <p className="font-semibold text-white/90">Cart</p>
      <p className="text-white/70">{`Total items: ${cart?.totalItems || 0}`}</p>
      <p className="text-white/70">{`Total price: ${cart?.subtotal || 0}`}</p>
      <button className="btn btn-primary">Checkout</button>
    </div>
  );
}
