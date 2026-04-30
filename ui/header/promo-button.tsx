"use client";
import { Promotion } from "@/lib/models";
import { useCartData } from "@/lib/cart/cart-data-context";
import { useState } from "react";
import { useCartTray } from "@/lib/cart/cart-tray-context";

export default function PromotionButton({
  promotion,
}: {
  promotion: Promotion;
}) {
  const [isApplied, setIsApplied] = useState(false);
  const { open } = useCartTray(); //isPending only applies to server calls
  const { applyPromotion } = useCartData();
  const handleApply = () => {
    setIsApplied(true);
    open();
    applyPromotion(promotion);

    setTimeout(() => setIsApplied(false), 2000);
  };
  return (
    <button
      className="bg-zinc-600  text-white px-4 py-2 rounded-md"
      onClick={handleApply}
      disabled={isApplied}
    >
      {isApplied ? "Applied" : promotion.code}
    </button>
  );
}
