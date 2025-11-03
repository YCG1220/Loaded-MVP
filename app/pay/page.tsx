import Image from "next/image";

export default function PayPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px]">
      <section className="card space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-red">Wallet balance • $42.18</p>
          <h2 className="font-display text-3xl font-semibold text-brand-dark">LoadedPay Wallet</h2>
          <p className="text-sm text-brand-dark/70">Tap to pay in-store, auto reload after checkout, and manage saved cards.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-brand-red/20 bg-brand-dark p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">LoadedPay</span>
              <span className="rounded-full bg-brand-red px-3 py-1 text-[10px] uppercase tracking-[0.3em]">Fan</span>
            </div>
            <p className="mt-8 text-3xl font-semibold">$42.18</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Card ending • 8842</p>
            <div className="mt-6 flex gap-3">
              <button className="btn-primary bg-white text-brand-dark">Add funds</button>
              <button className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10">
                Auto reload
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-red/10 bg-white/80 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Scan to earn</p>
            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LoadedPayDemo"
              alt="LoadedPay QR"
              width={160}
              height={160}
              className="mx-auto mt-4 rounded-xl border border-brand-red/10 bg-white p-4"
            />
            <p className="mt-4 text-center text-xs text-brand-dark/60">Show this code at the counter to earn points on in-store purchases.</p>
          </div>
        </div>
      </section>

      <aside className="card space-y-5">
        <div className="section-title">
          <span className="h-2 w-2 rounded-full bg-brand-red" />
          Saved cards
        </div>
        <div className="space-y-4 text-sm text-brand-dark/70">
          <div className="rounded-2xl border border-brand-red/10 bg-white/70 p-4">
            <p className="font-semibold text-brand-dark">Visa •••• 8842</p>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/40">Default for mobile checkout</p>
          </div>
          <div className="rounded-2xl border border-brand-red/10 bg-white/70 p-4">
            <p className="font-semibold text-brand-dark">Apple Pay</p>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/40">Linked to Loaded Wallet</p>
          </div>
        </div>
        <button className="btn-primary w-full">Add new payment method</button>
        <div className="rounded-2xl border border-brand-red/10 bg-brand-cream/60 p-4 text-xs text-brand-dark/70">
          <p className="font-semibold uppercase tracking-[0.3em] text-brand-dark">Security checklist</p>
          <ul className="mt-2 space-y-1">
            <li>• Stripe test mode enabled</li>
            <li>• PCI data stored via Stripe only</li>
            <li>• Supabase service role locked to server actions</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
