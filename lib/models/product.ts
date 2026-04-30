export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Price in cents (USD). e.g. 3000 = $30.00 */
  price: number;
  currency: string;
  category: string;
  images: string[];
  featured: boolean;
  tags: string[];
  createdAt: string;
}
export type ProductSearchParams = Promise<{
  category?: string;
  tag?: string;
  search?: string;
  featured?: string;
  page?: string;
  per_page?: string;
}>;
