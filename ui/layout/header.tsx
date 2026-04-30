import Link from "next/link";
import Logo from "../header/logo";
import Menu from "../header/menu";
import Promobar from "../header/promo-bar";

export default function Header() {
  return (
    <header className="w-full shrink-0 border-b border-white/10 bg-zinc-900 text-white">
      <div className="  w-full w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:gap-4">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
            <Menu />
          </div>
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end"></div>
        </div>
        <Promobar />
      </div>
    </header>
  );
}
