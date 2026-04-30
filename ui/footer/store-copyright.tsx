import { getStoreConfig } from "@/lib/api";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

export default async function StoreCopyright() {
  return (
    <Suspense fallback={<div>© 2026 All rights reserved.</div>}>
      <StoreCopyrightWithDate />
    </Suspense>
  );
}

async function StoreCopyrightWithDate() {
  //get the store config and current year in cache component
  "use cache";
  cacheLife("storeConfig");
  const store = await getStoreConfig();
  const year = new Date().getFullYear().toString();
  return (
    <div>
      © {year} {store?.data?.storeName || "Swag Store"}. All rights reserved.
    </div>
  );
}
