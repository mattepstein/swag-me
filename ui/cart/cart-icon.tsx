import { useCartData } from "../../lib/cart/cart-data-context";
type CartIconProps = {
  className?: string;
  size?: number;
};

export function CartIconSVG({ className = "", size = 24 }: CartIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.8a1 1 0 0 0 1-.8L21 7H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
    </svg>
  );
}
export default function CartTrayIcon() {
  const { cart } = useCartData();
  const count = cart?.totalItems ?? 0;
  return (
    <div className="flex items-center  mx-1 px-1">
      <CartIconSVG />
      <div className="text-sm font-medium">{count > 0 ? count : ""} </div>
    </div>
  );
}
