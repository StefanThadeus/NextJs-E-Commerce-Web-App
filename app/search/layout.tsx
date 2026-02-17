import CategorySidebar from "@/components/category-sidebar";
import SortingControls from "@/components/sorting-controls";
import { getAllCategoriesCached } from "@/lib/actions";
import { ReactNode, Suspense } from "react";

async function CategorySidebarServerWrapper() {
  const categories = await getAllCategoriesCached();

  return <CategorySidebar categories={categories} />;
}

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <main className="container mx-auto py-4">
      <div className="flex gap-8">
        <div className="w-[125px] flex-none">
          <Suspense
            fallback={<div className="w-[125px] flex-0">Loading...</div>}
          >
            <CategorySidebarServerWrapper />
          </Suspense>
        </div>

        <div className="flex-1">{children}</div>

        <div className="w-[125px] flex-none">
          <SortingControls />
        </div>
      </div>
    </main>
  );
}
