import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i8qy5y6gxkdgdcv9.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  cacheComponents: true, // Enable Cache Components (top-level in 16.1.x+)
  cacheLife: {
    // Product catalog - moderate cache
    products: {
      stale: 300, // 5 minutes fresh
      revalidate: 900, // 15 minutes before revalidation
      expire: 3600, // 1 hour max
    },
    stock: {
      stale: 60, // 1 minutes fresh
      revalidate: 120, // 2 minutes before revalidation
      expire: 300, // 5 minutes max
    },
    storeConfig: {
      stale: 3600, // 1 hour fresh
      revalidate: 7200, // 2 hours before revalidation
      expire: 86400, // 1 day max
    },
    categories: {
      stale: 3600, // 1 hour fresh
      revalidate: 7200, // 2 hours before revalidation
      expire: 86400, // 1 day max
    },
  },
};

export default nextConfig;
