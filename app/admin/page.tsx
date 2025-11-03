import Link from "next/link";

const cards = [
  { href: "/admin/menu", title: "Menu management", description: "Add, edit, and retire guest-facing items." },
  { href: "/admin/modifiers", title: "Modifiers", description: "Configure add-ons, required choices, and upcharges." },
  { href: "/admin/inventory", title: "Inventory", description: "Track grams per portion and manage stock levels." },
  { href: "/admin/rewards", title: "Rewards", description: "Create point-based perks for MyLoaded." },
  { href: "/admin/offers", title: "Offers", description: "Launch promo codes and app-exclusive deals." },
  { href: "/admin/orders", title: "Orders", description: "Monitor live orders and status changes." },
];

export default function AdminIndex() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="rounded-3xl border border-brand-red/10 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <h2 className="font-display text-xl font-semibold text-brand-dark">{card.title}</h2>
          <p className="mt-2 text-sm text-brand-dark/70">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
