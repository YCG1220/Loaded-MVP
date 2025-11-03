import { RewardProgress } from "../../components/shared/reward-progress";
import { OfferCard } from "../../components/shared/offer-card";

const rewards = [
  { id: "fries-100", title: "Crispy Fries", description: "Redeem for any fry build", badge: "100 pts" },
  { id: "shake-200", title: "ThickShake Upgrade", description: "Any size ThickShake", badge: "200 pts" },
  { id: "combo-300", title: "Freak Combo", description: "Burger + fries bundle", badge: "300 pts" },
];

const offers = [
  { id: "friend-tier", title: "Friend Tier Boost", description: "Spend $50 this month for 1.1x points", badge: "Tier" },
  { id: "birthday", title: "Birthday Treat", description: "Free shake in your birthday week", badge: "Perk" },
];

export default function MyLoadedPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px]">
      <section className="card space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-red">Fan tier • 720 pts</p>
          <h2 className="font-display text-3xl font-semibold text-brand-dark">MyLoaded Hub</h2>
          <p className="text-sm text-brand-dark/70">Track your yearly progress, redeem rewards, and apply offers before checkout.</p>
        </header>
        <RewardProgress currentPoints={720} nextTierPoints={1000} currentTier="Fan" nextTier="Friend" />

        <div className="space-y-4">
          <div className="section-title">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            Redeemable Rewards
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rewards.map((reward) => (
              <OfferCard key={reward.id} offer={reward} />
            ))}
          </div>
        </div>
      </section>

      <aside className="card space-y-5">
        <div className="section-title">
          <span className="h-2 w-2 rounded-full bg-brand-red" />
          Activated Offers
        </div>
        <div className="space-y-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
        <div className="rounded-2xl border border-brand-red/10 bg-brand-cream/60 p-4 text-sm text-brand-dark/70">
          <p className="font-semibold text-brand-dark">Loaded Levels</p>
          <ul className="mt-2 space-y-1 text-xs uppercase tracking-[0.3em]">
            <li className="flex justify-between">
              <span>Fan</span>
              <span>0 - 999 pts • 1x earn</span>
            </li>
            <li className="flex justify-between text-brand-red">
              <span>Friend</span>
              <span>1000 - 2499 pts • 1.1x earn</span>
            </li>
            <li className="flex justify-between">
              <span>Freak</span>
              <span>2500+ pts • 1.25x earn</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
