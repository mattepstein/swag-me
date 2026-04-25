import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getStoreConfig } from "./lib/api";

import Header, { HeaderSkeleton } from "./ui/layout/header";
import RightRail from "./ui/layout/right-rail";
import CartDataHost from "./ui/cart/cart-rail";
import { CartDataProvider } from "./lib/cart/cart-context";
import { CartUIProvider } from "./ui/cart/cart-ui-context";
import Footer from "./ui/layout/footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_SEO = {
  defaultTitle: "Swag Me",
  titleTemplate: "%s | Swag Me",
  defaultDescription: "Swag Me is a store that sells swag.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getStoreConfig()
    .then((res) => res.data.seo)
    .catch(() => DEFAULT_SEO);

  return {
    title: {
      template: seo.titleTemplate,
      default: seo.defaultTitle,
    },
    description: seo.defaultDescription,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layoutBody = (
    <div className="relative flex min-h-0 min-w-0 flex-1">
      <div className="min-h-0 min-w-0 w-full flex-1 overflow-x-hidden">
        {children}
      </div>
      <RightRail />
    </div>
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
        <CartUIProvider>
          <Suspense
            fallback={<CartDataProvider>{layoutBody}</CartDataProvider>}
          >
            <CartDataHost>{layoutBody}</CartDataHost>
          </Suspense>
        </CartUIProvider>
        <Footer />
      </body>
    </html>
  );
}
