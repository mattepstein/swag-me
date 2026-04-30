import { Suspense } from "react";
import StoreCopyright from "../footer/store-copyright";

export default function Footer() {
  return (
    <footer className="mt-auto w-full shrink-0 border-t border-white/10 bg-zinc-900 py-4 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-white/80">
          <Suspense
            fallback={<div>© 2026 Swag Store. All rights reserved.</div>}
          >
            <StoreCopyright />
          </Suspense>
        </div>
      </div>
    </footer>
  );
}
