import ProductNotFoundCard from "@/ui/product/product-not-found";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-white px-4 py-8">
      <div className="container mx-auto grid grid-cols-1 gap-4">
        <section className="relative isolate w-full overflow-hidden">
          <ProductNotFoundCard notFoundCopy="Let's try something else..." />

          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
            <Link
              href="/products"
              className="inline-flex  text-xl  items-center justify-center rounded-md bg-zinc-900 px-5 py-2.5   font-medium text-white shadow-lg transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              All Products
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
