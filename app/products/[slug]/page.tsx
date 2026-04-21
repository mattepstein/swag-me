import { getProduct, listProducts } from "@/app/lib/api";
import ImageCarousel from "@/app/ui/product/image-carousel";
import StockStatus from "@/app/ui/product/stock-status";
import AddToCartButton from "@/app/ui/product/add-to-cart-button";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const products = await listProducts();
  if (!products?.data) {
    return [];
  }
  return products.data.map((product) => ({
    slug: product.id,
  }));
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
          </div>
        }
      >
        <ProductDetail slug={params.slug} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product?.data) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold">{product.data.name}</h1>
      <p className="text-gray-500">{product.data.description}</p>
      <ImageCarousel images={product.data.images} />
      <p className="text-gray-500">${product.data.price / 100}</p>
      <Suspense fallback={<div>Loading stock…</div>}>
        <StockStatus productId={product.data.id} />
      </Suspense>
      <AddToCartButton product={product.data} />
    </>
  );
}
