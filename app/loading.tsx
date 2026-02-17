import ProductsSkeleton from "./ProductsSkeleton";
import { BreadcrumbsSkeleton } from "@/components/breadcrumbs-skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto py-4">
      <BreadcrumbsSkeleton />
      <ProductsSkeleton />
    </main>
  );
}
