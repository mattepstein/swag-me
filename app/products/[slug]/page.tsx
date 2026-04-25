import { Suspense } from "react";
import { listProducts } from "@/app/lib/api";
import ProductDetail, {
  ProductDetailSkeleton,
} from "@/app/ui/product/product-detail";

export async function generateStaticParams() {
  const products = await listProducts({ limit: 100 });
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
    <main className="container mx-0 px-4 py-8">
      <Suspense fallback=<ProductDetailSkeleton />>
        <ProductDetail slug={params.slug} />
      </Suspense>
    </main>
  );
}
