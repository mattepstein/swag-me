import type { Metadata } from "next";
import "../globals.css";
import LeftRail, { LeftRailSkeleton } from "../../ui/layout/left-rail";

import { listCategories } from "../../lib/api/categories";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Products",
    description: "Products page",
  };
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container flex flex-1 mx-auto h-full">
      <Suspense fallback={<LeftRailSkeleton />}>
        <LeftRailLayout />
      </Suspense>

      <div className="min-h-0 min-w-0  overflow-x-hidden h-full px-4 py-8">
        {children}
      </div>
    </div>
  );
}
export async function LeftRailLayout() {
  // get category list before client side interactions.
  const categoryList = await listCategories();
  return <LeftRail categoryList={categoryList?.data || []} />;
}
