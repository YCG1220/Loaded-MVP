import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import { Providers } from "../components/layout/providers";
import { BottomNav } from "../components/layout/bottom-nav";
import { SidebarNav } from "../components/layout/sidebar-nav";
import { TopHeader } from "../components/layout/top-header";

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
          <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,#fff4e5_0%,#ffe1c4_45%,#fbd7c0_75%,#f4c3b3_100%)]">
            <SidebarNav />
            <div className="flex min-h-screen w-full flex-col">
              <TopHeader />
              <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 xl:px-12">
                <div className="mx-auto w-full max-w-[1280px] space-y-8">{children}</div>
              </main>
            </div>
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
