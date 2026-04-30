import { getActivePromotion } from "@/lib/api";
import clsx from "clsx";
import { Suspense } from "react";
import PromotionButton from "./promo-button";

const promoBarStyle = (skeleton: boolean) =>
  clsx("w-full", {
    "animate-pulse h-20": skeleton,
    "text-white": !skeleton,
  });

function PromobarSkeleton() {
  return <div className={promoBarStyle(true)} />;
}

export default function Promobar() {
  return (
    <Suspense fallback={<PromobarSkeleton />}>
      <PromobarComponent />
    </Suspense>
  );
}

async function PromobarComponent() {
  const promotion = await getActivePromotion();
  const data = promotion?.data;
  if (!data?.active) {
    return <div className={promoBarStyle(false)} />;
  }

  return (
    <div className={promoBarStyle(false)}>
      <span className="text-white">
        {data.description}{" "}
        {data.code && data.discountPercent > 0 ? (
          <PromotionButton promotion={data} />
        ) : null}
      </span>
    </div>
  );
}
