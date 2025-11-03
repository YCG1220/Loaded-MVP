"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, GiftIcon, CreditCardIcon, Squares2X2Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/order", label: "Order", icon: Squares2X2Icon },
  { href: "/myloaded", label: "MyLoaded", icon: GiftIcon },
  { href: "/pay", label: "Pay", icon: CreditCardIcon },
  { href: "/more", label: "More", icon: UserCircleIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(420px,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-white/40 bg-white/90 p-2 shadow-2xl shadow-brand-red/10 backdrop-blur">
      <ul className="grid grid-cols-5 gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "flex flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition",
                  isActive ? "bg-brand-red text-white shadow-lg shadow-brand-red/40" : "text-brand-dark/70 hover:bg-brand-red/10"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
