import { getStoreConfig } from "@/lib/api/store";
import { Suspense } from "react";

async function StoreNameLoader() {
  const store = await getStoreConfig();
  const storeName = store?.data?.storeName;
  return <span className="text-2xl font-bold">{storeName}</span>;
}
export default function StoreName() {
  return (
    <Suspense fallback={<span className="text-2xl font-bold">Swag Store</span>}>
      <StoreNameLoader />
    </Suspense>
  );
}
