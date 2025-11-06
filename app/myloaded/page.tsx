import Image from "next/image";
import { RewardProgress } from "../../components/shared/reward-progress";
import { OfferCard } from "../../components/shared/offer-card";
import { RewardCard } from "../../components/shared/reward-card";
import { fetchLoyaltyContent } from "../../src/lib/loyalty-service";

const numberFormatter = new Intl.NumberFormat();

export default async function MyLoadedPage() {
  const { rewards, offers } = await fetchLoyaltyContent();
  const activeRewards = rewards.filter((reward) => reward.isActive);
  const activeOffers = offers.filter((offer) => offer.isActive);

  const spendablePoints = Number(process.env.NEXT_PUBLIC_DEMO_SPENDABLE_POINTS ?? 0);
  const yearlyPoints = Number(process.env.NEXT_PUBLIC_DEMO_YEARLY_POINTS ?? 0);
  const currentTier = process.env.NEXT_PUBLIC_DEMO_TIER ?? "Fan";
  const nextTier = process.env.NEXT_PUBLIC_DEMO_NEXT_TIER ?? "Friend";
  const nextTierPoints = Number(process.env.NEXT_PUBLIC_DEMO_NEXT_TIER_POINTS ?? 1000);

  return (
    <div className="space-y-12 pb-20">
      <section className="relative overflow-hidden rounded-[40px] border border-brand-red/20 bg-brand-red text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80"
            alt="Rewards hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative grid gap-10 p-10 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
              <span>MyLoaded Rewards</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem]">
                {activeRewards.length} active
              </span>
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight lg:text-5xl">
              Feed your inner freak & cash in on every visit.
            </h1>
            <p className="max-w-xl text-sm text-white/80 lg:text-base">
              Track points, redeem rewards, and stack offers before you hit checkout. Everything in this hub comes straight from
              your admin-managed catalog.
            </p>
            <dl className="grid gap-4 sm:grid-cols-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <dt>Spendable pts</dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {numberFormatter.format(spendablePoints)}
                </dd>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <dt>Yearly pts</dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {numberFormatter.format(yearlyPoints)}
                </dd>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <dt>Live offers</dt>
                <dd className="mt-1 text-2xl font-semibold text-white">
                  {activeOffers.length}
                </dd>
              </div>
            </dl>
          </div>
          <RewardProgress
            currentPoints={spendablePoints}
            nextTierPoints={nextTierPoints}
            currentTier={currentTier}
            nextTier={nextTier}
            className="shadow-2xl"
          />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr),minmax(0,0.8fr)]">
        <div className="space-y-8 rounded-[32px] border border-brand-red/15 bg-white/95 p-8 shadow-xl shadow-brand-red/10">
          <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Rewards catalog</p>
              <h2 className="font-display text-3xl font-semibold text-brand-dark">Ready to redeem</h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
              {numberFormatter.format(spendablePoints)} pts available
            </span>
          </header>
          <div className="grid gap-5 md:grid-cols-2">
            {activeRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
            {activeRewards.length === 0 && (
              <div className="rounded-3xl border border-dashed border-brand-red/20 bg-brand-cream/70 p-6 text-sm text-brand-dark/60">
                Add rewards from the admin panel to see them here.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-brand-red/15 bg-white/95 p-6 shadow-xl shadow-brand-red/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Active offers</p>
                <h2 className="font-display text-2xl font-semibold text-brand-dark">Boost your earn</h2>
              </div>
              <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                {activeOffers.length}
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {activeOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
              {activeOffers.length === 0 && (
                <div className="rounded-2xl border border-dashed border-brand-red/20 bg-brand-cream/70 p-4 text-sm text-brand-dark/60">
                  When offers are published in the admin panel they will appear instantly.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-brand-red/15 bg-brand-dark p-6 text-white shadow-xl shadow-brand-dark/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-yellow">Loaded levels</p>
                <h2 className="font-display text-2xl font-semibold">Tier breakdown</h2>
              </div>
            </div>
            <ul className="mt-5 space-y-4 text-sm">
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
            <p className="mt-4 text-xs text-white/60">
              Manage tier thresholds from your loyalty settings admin panel to keep this synced across environments.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
