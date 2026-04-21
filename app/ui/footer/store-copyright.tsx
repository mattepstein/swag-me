import { getStoreConfig } from "@/app/lib/api";

export default async function StoreCopyright() {
  const store = await getStoreConfig();
  const year = 2026;
  return (
    <div>
      {`© ${year} ${store?.data?.storeName || "Swag Store"}. All rights reserved.`}
    </div>
  );
}
