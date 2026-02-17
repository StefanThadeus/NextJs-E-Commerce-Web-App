import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { MobileNav } from "./mobile-nav";
import { SearchInput } from "./search-input";
import { CartIndicator } from "./cart-indicator";
import AuthStatus from "./auth-status";

export const categories = [
  { id: 1, name: "Electronics", href: "/search/electronics" },
  { id: 2, name: "Clothing", href: "/search/clothing" },
  { id: 3, name: "Home", href: "/search/home" },
];

export function Navbar() {
  return (
    <div className="border-b border-dashed">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div>
          <div className="flex items-center gap-6">
            <Link className="text-2xl font-bold hidden md:block" href="/">
              Store
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            <MobileNav />
          </div>
        </div>

        <div className="block w-full mx-4 md:mx-8">
          <SearchInput />
        </div>

        <div className="flex items-center gap-0">
          <AuthStatus />

          <CartIndicator />

          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
