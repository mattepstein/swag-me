import { ProductGridData } from "../product/product-grid";

export default async function FeaturedProducts() {
  return (
    <div className="flex flex-col gap-4 mt-16 items-center justify-center ">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <ProductGridData
        page={1}
        limit={6}
        category={undefined}
        search={undefined}
        featured={true}
        showPagination={false}
      />
    </div>
  );
}
