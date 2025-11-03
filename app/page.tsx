import Link from "next/link";
import Image from "next/image";
import { RewardProgress } from "../components/shared/reward-progress";
import { OfferCard } from "../components/shared/offer-card";
import { StoreFinder } from "../components/shared/store-finder";

const offers = [
  {
    id: "welcome",
    title: "Welcome to Loaded",
    description: "Earn 100 bonus points on your first mobile order.",
    badge: "New",
    expiresAt: "Ends July 31",
  },
  {
    id: "shake",
    title: "SHAKE50",
    description: "50 bonus points when you add a ThickShake to your combo.",
    badge: "Code",
    expiresAt: "Weekend only",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-red">Fan status • 720 pts</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-brand-dark">Fast food, maxed out.</h2>
            <p className="mt-3 text-sm text-brand-dark/70">
              Loaded brings Sheetz-style customization to burgers, fries, and shakes. Order in under 60 seconds, earn
              rewards, and skip the line with LoadedPay.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/order" className="btn-primary">
              Start an Order
            </Link>
            <Link
              href="/myloaded"
              className="inline-flex items-center justify-center rounded-full border border-brand-red/30 bg-white/80 px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm shadow-brand-red/10 transition hover:border-brand-red hover:shadow-lg"
            >
              View Rewards
            </Link>
          </div>
          <RewardProgress currentPoints={720} nextTierPoints={1000} currentTier="Fan" nextTier="Friend" />
        </div>
        <div className="relative h-72 overflow-hidden rounded-3xl border border-brand-red/10 bg-gradient-to-br from-brand-red/10 via-brand-yellow/20 to-brand-cream/80 p-6 shadow-xl shadow-brand-red/20">
          <div className="absolute inset-0 opacity-40">
            <Image src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe" alt="Loaded hero" fill className="object-cover object-center" priority />
          </div>
          <div className="relative flex h-full flex-col justify-between">
            <div className="self-start rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-brand-dark shadow-md shadow-brand-red/10">
              Always Loaded
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark/70">Featured Drop</p>
              <h3 className="font-display text-2xl font-semibold text-brand-dark">Truffle Freak Fries</h3>
              <p className="text-sm text-brand-dark/80">
                Hand-cut fries, black truffle aioli, parmesan snow, scallion crunch. Freak-level flavor.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="section-title">
          <span className="h-2 w-2 rounded-full bg-brand-red" />
          On Your Account
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <div className="card space-y-4">
          <div className="section-title">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            Featured Stores
          </div>
          <StoreFinder />
        </div>
        <div className="card space-y-4">
          <div className="section-title">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            App Highlights
          </div>
          <ul className="space-y-4 text-sm text-brand-dark/80">
            <li>
              <strong className="text-brand-dark">Loaded Levels:</strong> Fan → Friend → Freak tiers automatically unlock faster
              points earnings.
            </li>
            <li>
              <strong className="text-brand-dark">Realtime Inventory:</strong> Kitchen counts update instantly so 86s never hit the guest view.
            </li>
            <li>
              <strong className="text-brand-dark">Checkout Built-In:</strong> LoadedPay wallet, stored cards, and Apple/Google Wallet passes.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
