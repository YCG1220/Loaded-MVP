import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import { Providers } from "../components/layout/providers";
import { BottomNav } from "../components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Loaded - Fast Casual Done Right",
  description: "Order Loaded's signature fries, shakes, and sandwiches while earning rewards.",
  metadataBase: new URL("https://loaded.local"),
  openGraph: {
    title: "Loaded",
    description: "Loaded fast food ordering experience",
    images: [{ url: "https://images.unsplash.com/photo-1606755962773-0e7d5d0c6ac0" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-brand-cream text-brand-dark">
        <Providers>
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-4 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-red">Loaded</p>
                  <h1 className="font-display text-2xl font-semibold text-brand-dark">Built for craveable speed.</h1>
                </div>
                <div className="hidden rounded-full border border-brand-red/10 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark shadow-sm shadow-brand-red/10 backdrop-blur sm:block">
                  MVP Preview
                </div>
              </div>
            </header>
            <main className="flex-1 pb-10">{children}</main>
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
