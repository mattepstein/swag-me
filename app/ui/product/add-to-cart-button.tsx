"use-client";
import { Product } from "@/app/lib/models";

async function addItemToCart(productId: string) {
  const token = "123";
  console.log("adding item to cart", productId);
}
export default async function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  //onClick={() => addItemToCart(product.id)}
  return (
    <div>
      <button>Add to Cart</button>
    </div>
  );
}
