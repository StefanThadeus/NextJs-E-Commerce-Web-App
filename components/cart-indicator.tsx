"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/use-cart";

export function CartIndicator() {
  const { itemCount, isLoading } = useCart();

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart />

        {!isLoading && itemCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
