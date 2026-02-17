"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SortingControls() {
  const pathname = usePathname();
  const searhParams = useSearchParams();
  const currentSort = searhParams.get("sort");

  const createSortUrl = (sortValue: string | null): string => {
    const params = new URLSearchParams(searhParams.toString());

    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();

    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <>
      <h3 className="text-xs text-muted-foreground mb-2">Sort By</h3>

      <ul className="">
        <li>
          <Link
            href={createSortUrl(null)}
            className={cn(
              "text-sm hover:text-primary",
              !currentSort && "underline"
            )}
          >
            Latest
          </Link>
        </li>
        <li>
          <Link
            href={createSortUrl("price-asc")}
            className={cn(
              "text-sm hover:text-primary",
              currentSort === "price-asc" && "underline"
            )}
          >
            Price: Low to High
          </Link>
        </li>
        <li>
          <Link
            href={createSortUrl("price-desc")}
            className={cn(
              "text-sm hover:text-primary",
              currentSort === "price-desc" && "underline"
            )}
          >
            Price: High to Low
          </Link>
        </li>
      </ul>
    </>
  );
}
