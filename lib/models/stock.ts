export interface StockInfo {
  productId: string;
  /** Current stock quantity (dynamic, may change on every request) */
  stock: number;
  inStock: boolean;
  /** True when stock is between 1 and 5 */
  lowStock: boolean;
}
