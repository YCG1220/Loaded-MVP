"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HomeModernIcon,
  Squares2X2Icon,
  SparklesIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home", icon: HomeModernIcon },
  { href: "/order", label: "Order", icon: Squares2X2Icon },
  { href: "/myloaded", label: "MyLoaded", icon: SparklesIcon },
  { href: "/pay", label: "Pay", icon: CreditCardIcon },
  { href: "/more", label: "More", icon: EllipsisVerticalIcon },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col justify-between bg-brand-dark/95 px-6 pb-10 pt-8 text-white lg:flex">
      <div className="space-y-10">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-brand-red">
            <Image
              src="https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=200&q=80"
              alt="Loaded Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-yellow">Loaded</p>
            <p className="font-display text-xl font-semibold leading-tight">Feel it. Freak it.</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] transition", 
                  isActive ? "bg-brand-red text-white shadow-lg shadow-brand-red/60" : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 rounded-2xl bg-white/5 p-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          <p className="text-brand-yellow">Next Drop</p>
          <p className="text-sm normal-case tracking-normal text-white">
            Ultimate Toppers menu lands Friday @ 10PM. Load points, skip the line, own the night.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs text-white/60">
        <p className="font-semibold uppercase tracking-[0.3em] text-white/80">Support</p>
        <p>24/7 hotline • (888) 555-0168</p>
        <p>Order issues? DM @loadedofficial</p>
        <p className="text-white/40">© {new Date().getFullYear()} Loaded Holdings</p>
      </div>
    </aside>
  );
}
