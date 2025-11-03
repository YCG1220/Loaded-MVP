const links = [
  {
    title: "Account settings",
    description: "Update profile, delivery addresses, and communication preferences.",
  },
  { title: "Nutrition & allergens", description: "View macros and allergen statements for every menu item." },
  { title: "Support center", description: "Chat with our team or report an issue with an order." },
  { title: "Careers", description: "Join the Loaded crew – hiring managers see submissions instantly." },
];

export default function MorePage() {
  return (
    <section className="card space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-red">Utility</p>
        <h2 className="font-display text-3xl font-semibold text-brand-dark">More from Loaded</h2>
        <p className="text-sm text-brand-dark/70">Centralized resources for support, hiring, nutrition, and more.</p>
      </header>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.title} className="rounded-3xl border border-brand-red/10 bg-white/80 p-5 shadow-sm shadow-brand-red/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-brand-dark">{link.title}</h3>
                <p className="text-sm text-brand-dark/70">{link.description}</p>
              </div>
              <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                Open
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
