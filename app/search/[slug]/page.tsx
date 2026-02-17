import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import ProductsSkeleton from "../../ProductsSkeleton";
import { ProductListServerWrapper } from "@/components/product-list-server-wrapper";
import { getCategoryBySlugCached } from "@/lib/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlugCached(slug);

  if (!category) return {};

  return {
    title: category.name,
    openGraph: { title: category.name },
  };
}

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = await getCategoryBySlugCached(slug);

  if (!category) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Products", href: "/" },
    {
      label: category.name,
      href: `/search/${category?.slug}`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Suspense key={`${slug}-${sort}`} fallback={<ProductsSkeleton />}>
        <ProductListServerWrapper params={{ slug, sort }} />
      </Suspense>
    </>
  );
}
