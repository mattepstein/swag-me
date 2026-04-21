import { getActivePromotion } from "@/app/lib/api/promotions";
import CartStatus from "../header/cartstatus";
import Logo from "../header/logo";
import Menu from "../header/menu";
import Promobar from "../header/promobar";
import Searchbar from "../header/searchbar";
import { Suspense } from "react";
import { PromotionResponse } from "@/app/lib/models";

export function HeaderSkeleton() {
  return (
    <header className="w-full shrink-0 border-b border-white/10 bg-zinc-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Logo />
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end"></div>
        </div>
        <div className="mt-3 sm:hidden">
          <Searchbar />
        </div>
        <div className="mt-3 sm:hidden"></div>
      </div>
    </header>
  );
}

export default async function Header() {
  const promotion = (await getActivePromotion()) as PromotionResponse;
  const promotionData = promotion?.data || {
    id: "",
    title: "",
    description: "",
    discountPercent: 0,
    code: "",
    validFrom: "",
    validUntil: "",
    active: false,
  };

  return (
    <header className="w-full shrink-0 border-b border-white/10 bg-zinc-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <Logo />
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end"></div>
        </div>
        <div className="mt-3 sm:hidden">
          <Searchbar />
        </div>
        <Suspense fallback={<div></div>}>
          <Promobar promotion={promotionData} />
        </Suspense>
      </div>
    </header>
  );
}
