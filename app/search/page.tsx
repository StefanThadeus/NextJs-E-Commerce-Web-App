import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import ProductsSkeleton from "../ProductsSkeleton";
import { ProductListServerWrapper } from "@/components/product-list-server-wrapper";

type SearchPageProps = {
  searchParams: Promise<{ query?: string; sort?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const sort = params.sort?.trim() ?? "";

  const breadcrumbs = [
    { label: "Products", href: "/" },
    {
      label: `Results for "${query}"`,
      href: `/search?query=${encodeURIComponent(query)}`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Suspense key={`${query}-${sort}`} fallback={<ProductsSkeleton />}>
        <ProductListServerWrapper params={{ query, sort }} />
      </Suspense>
    </>
  );
}
