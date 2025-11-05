import { RewardProgress } from "../../components/shared/reward-progress";
import { OfferCard } from "../../components/shared/offer-card";
import Image from "next/image";

const rewards = [
  { id: "fries-100", title: "Crispy Fries", description: "Redeem any fry build", badge: "100 pts", expiresAt: "Always" },
  { id: "shake-200", title: "ThickShake Upgrade", description: "Size up your shake", badge: "200 pts", expiresAt: "30 days" },
  { id: "combo-300", title: "Freak Combo", description: "Burger + fries bundle", badge: "300 pts", expiresAt: "15 days" },
];

const offers = [
  { id: "friend-tier", title: "Friend Tier Boost", description: "Spend $50 for 1.1x points", badge: "Tier", expiresAt: "This month" },
  { id: "birthday", title: "Birthday Treat", description: "Free shake in your birthday week", badge: "Perk", expiresAt: "7 days" },
];

export default function MyLoadedPage() {
  return (
    <div className="space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-[40px] border border-brand-red/20 bg-white shadow-xl">
        <Image
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80"
          alt="Rewards hero"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative grid gap-8 p-10 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex w-fit rounded-full bg-brand-red px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white">
              MyLoaded hub
            </span>
            <h1 className="font-display text-4xl font-semibold text-brand-dark">Level up to Friend status in 280 pts.</h1>
            <p className="text-sm text-brand-dark/70">
              Track yearly progression, activate offers, and drop rewards straight into checkout. Fan streak bonuses hit every night after 9PM.
            </p>
          </div>
          <RewardProgress currentPoints={720} nextTierPoints={1000} currentTier="Fan" nextTier="Friend" className="shadow-2xl" />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr),minmax(0,0.8fr)]">
        <div className="card space-y-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Redeemable rewards</p>
              <h2 className="font-display text-3xl font-semibold text-brand-dark">Ready to claim</h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">720 spendable pts</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((reward) => (
              <OfferCard key={reward.id} offer={reward} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Activated offers</p>
              <h2 className="font-display text-2xl font-semibold text-brand-dark">Boost your earn</h2>
            </div>
            <div className="space-y-3">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
          <div className="card space-y-4 bg-brand-dark text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-yellow">Loaded levels</p>
              <h2 className="font-display text-2xl font-semibold">Tier breakdown</h2>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="uppercase tracking-[0.3em]">Fan</span>
                <span className="text-white/70">0 - 999 pts • 1x earn</span>
              </li>
              <li className="flex items-center justify-between text-brand-yellow">
                <span className="uppercase tracking-[0.3em]">Friend</span>
                <span>1000 - 2499 pts • 1.1x earn</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="uppercase tracking-[0.3em]">Freak</span>
                <span className="text-white/70">2500+ pts • 1.25x earn</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
