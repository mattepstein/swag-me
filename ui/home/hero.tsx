import { getStoreConfig } from "@/lib/api/store";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/hero.webp";

export default async function Hero() {
  const store = await getStoreConfig();
  const heroCopy = `Welcome to the ${store?.data?.storeName ?? "Swag Store"}!`;

  return (
    <section className="relative isolate w-full min-h-[min(85vw,22rem)] overflow-hidden sm:min-h-[28rem]">
      <Image
        src={heroImage}
        alt=""
        fill
        placeholder="blur"
        className="object-cover"
        sizes="100vw"
        loading="eager"
        quality={90}
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden />
      <div className="relative z-10 flex min-h-[min(85vw,22rem)] flex-col items-center justify-center gap-5 px-6 py-14 text-center text-white sm:min-h-[28rem] sm:gap-6 sm:py-20">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-balance drop-shadow-md sm:text-4xl">
          {heroCopy}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-white/95 drop-shadow sm:text-lg">
          {store?.data?.seo?.defaultDescription ??
            "Add some color to your life!"}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 shadow-md transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
