import Image from "next/image";

export default function PayPage() {
  return (
    <div className="space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-[40px] border border-brand-red/20 bg-white shadow-xl">
        <Image
          src="https://images.unsplash.com/photo-1521302080372-0225f0b9c4c3?auto=format&fit=crop&w=1600&q=80"
          alt="LoadedPay hero"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative grid gap-8 p-10 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full bg-brand-red px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white">
              LoadedPay wallet
            </span>
            <h1 className="font-display text-4xl font-semibold text-brand-dark">Tap, scan, and earn 1.25x on every late-night run.</h1>
            <p className="text-sm text-brand-dark/70">
              Secure cards, auto reloads, and instant wallet passes keep the line moving. Sync across devices with Supabase auth and Stripe payment methods.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
              <span className="rounded-full border border-brand-red/20 px-3 py-2">$42.18 balance</span>
              <span className="rounded-full border border-brand-red/20 px-3 py-2">Last reload: 2 days ago</span>
              <span className="rounded-full border border-brand-red/20 px-3 py-2">Apple & Google Wallet</span>
            </div>
          </div>
          <div className="space-y-6 rounded-[28px] border border-brand-red/15 bg-white/85 p-6 shadow-lg shadow-brand-red/10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Instant wallet passes</p>
            <div className="grid gap-3 text-sm font-semibold text-brand-dark">
              <button className="rounded-2xl border border-brand-red/15 bg-white px-4 py-3 text-left transition hover:border-brand-red">
                Add to Apple Wallet
              </button>
              <button className="rounded-2xl border border-brand-red/15 bg-white px-4 py-3 text-left transition hover:border-brand-red">
                Add to Google Wallet
              </button>
              <button className="rounded-2xl border border-brand-red/15 bg-white px-4 py-3 text-left transition hover:border-brand-red">
                Download PDF barcode
              </button>
            </div>
            <p className="text-xs text-brand-dark/60">Wallet passes refresh after every successful Supabase session sign-in.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr),minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="card space-y-6 bg-brand-dark text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Wallet balance</p>
                <h2 className="font-display text-3xl font-semibold">$42.18</h2>
              </div>
              <span className="rounded-full bg-brand-red px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">Fan tier</span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Card ending • 8842</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary bg-white text-brand-dark">Add funds</button>
              <button className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10">
                Auto reload
              </button>
            </div>
          </div>

          <div className="card grid gap-6 md:grid-cols-[minmax(0,0.6fr),minmax(0,1fr)] md:items-center">
            <div className="rounded-[24px] border border-brand-red/15 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">Scan to earn</p>
              <Image
                src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=LoadedPayDemo"
                alt="LoadedPay QR"
                width={180}
                height={180}
                className="mx-auto mt-3 rounded-xl border border-brand-red/15 bg-white p-4"
              />
            </div>
            <div className="space-y-3 text-sm text-brand-dark/70">
              <p className="font-semibold text-brand-dark">Show this code at the counter to earn points on in-store purchases.</p>
              <ul className="space-y-2 text-xs uppercase tracking-[0.3em]">
                <li className="flex items-center justify-between">
                  <span>1 scan =</span>
                  <span>Auto apply offers</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Offline mode</span>
                  <span>Passkit cached</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Supports tipping</span>
                  <span>Stripe terminal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Saved methods</p>
              <h2 className="font-display text-2xl font-semibold text-brand-dark">Manage payments</h2>
            </div>
            <div className="space-y-4 text-sm text-brand-dark/70">
              <div className="rounded-[24px] border border-brand-red/15 bg-white px-4 py-3">
                <p className="font-semibold text-brand-dark">Visa •••• 8842</p>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/40">Default for mobile checkout</p>
              </div>
              <div className="rounded-[24px] border border-brand-red/15 bg-white px-4 py-3">
                <p className="font-semibold text-brand-dark">Apple Pay</p>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/40">Linked to Loaded Wallet</p>
              </div>
            </div>
            <button className="btn-primary w-full">Add new payment method</button>
          </div>

          <div className="card space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Security checklist</p>
            <ul className="space-y-2 text-xs uppercase tracking-[0.3em] text-brand-dark/60">
              <li>Stripe test mode enforced</li>
              <li>PCI data stays with Stripe</li>
              <li>Supabase service role locked to server actions</li>
              <li>Session secret rotates every deploy</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
