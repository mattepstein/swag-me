import { Suspense } from "react";
import { getProduct, listProducts } from "@/app/lib/api";
import ProductDetail, {
  ProductDetailSkeleton,
} from "@/app/ui/product/product-detail";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product?.data) {
    return {
      title: "Product not found",
      description: "Product not found",
    };
  }

  return {
    title: product.data.name,
    description: product.data.description || "",
    openGraph: {
      images: product.data.images,
    },
    twitter: {
      images: product.data.images,
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: product.data.images[0],
    },
  };
}

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
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail slug={params.slug} />
      </Suspense>
    </main>
  );
}
