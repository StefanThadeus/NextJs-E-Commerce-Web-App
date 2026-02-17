"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center h-screen text-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>

      <p className="text-sm text-muted-foreground">{error.message}</p>

      <Button onClick={() => reset()}>Try Again</Button>

      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        Go back to home
      </Link>
    </main>
  );
}
