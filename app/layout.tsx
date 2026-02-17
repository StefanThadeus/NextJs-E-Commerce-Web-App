import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "E-Commerce Store", template: "%s | E-Commerce Store" },
  description:
    "A modern e-commerce store built with Next.js, TypeScript and Tailwind CSS.",
  openGraph: {
    title: "E-Commerce Store",
    description:
      "A modern e-commerce store built with Next.js, TypeScript and Tailwind CSS.",
    siteName: "E-Commerce Store",
    url: process.env.NEXT_PUBLIC_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <>
                <header>
                  <Navbar />
                </header>
                {children}
                <footer className="border-t border-dashed py-6">
                  <div className="container mx-auto py-5 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} E-commerce Store, made by
                    Stefan Radenkovic. All rights reserved.
                  </div>
                </footer>
              </>
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </Suspense>
  );
}
