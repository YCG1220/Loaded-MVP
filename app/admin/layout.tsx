import Link from "next/link";
import { ReactNode } from "react";

const links = [
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/modifiers", label: "Modifiers" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/rewards", label: "Rewards" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-[220px,1fr] gap-8 pb-24 pt-6">
      <aside className="rounded-3xl border border-brand-red/10 bg-white/80 p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Admin Console</p>
        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-2xl px-4 py-3 text-sm font-semibold text-brand-dark/80 transition hover:bg-brand-red/10 hover:text-brand-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-brand-dark">Operations Control</h1>
            <p className="text-sm text-brand-dark/60">Secure admin tooling for menu, inventory, and loyalty management.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-brand-red/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark transition hover:border-brand-red"
          >
            View guest app
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
