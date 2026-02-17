import { getProductsCached, GetProductsParams } from "@/lib/actions";
import ProductList from "./product-list";

interface ProductListServerWrapperProps {
  params: GetProductsParams;
}

export async function ProductListServerWrapper({
  params,
}: ProductListServerWrapperProps) {
  const products = await getProductsCached(params);
  return <ProductList products={products} />;
}
