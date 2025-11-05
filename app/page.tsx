import Image from "next/image";
import Link from "next/link";
import { OfferCard } from "../components/shared/offer-card";
import { StoreFinder } from "../components/shared/store-finder";

const featuredCombos = [
  {
    id: "comboz",
    title: "Meal Comboz",
    description: "Lock in a sandwich, fries + drink from $5.79",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "freak-fries",
    title: "Ultimate Toppers",
    description: "Stacked fries with signature drizzles and crunch",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "late-night",
    title: "Late Night Freak",
    description: "2AM cravings answered with 1.25x points",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
];

const offers = [
  {
    id: "sheetz-style",
    title: "Ultimate Combo Drop",
    description: "Add any shake + loaded fry to unlock 150 bonus pts",
    badge: "Featured",
    expiresAt: "Ends Sunday",
  },
  {
    id: "community",
    title: "Community Night",
    description: "Show your local card for 10% off dine-in orders",
    badge: "Local",
    expiresAt: "Fridays",
  },
];

const communityStories = [
  {
    id: "bmx",
    title: "Loaded BMX Jam",
    blurb: "We fueled the Brooklyn Pump Track finals with Freak Combos for every rider.",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "art",
    title: "Local Mural Series",
    blurb: "Commissioned three neighborhood artists to paint our seasonal drop banners.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr),minmax(0,1fr)]">
        <article className="relative overflow-hidden rounded-[40px] border border-brand-red/20 bg-brand-dark text-white shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=1600&q=80"
            alt="Loaded combo hero"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="relative flex h-full flex-col justify-between gap-10 p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              <span className="rounded-full bg-white/10 px-4 py-1 text-white">Late Night exclusive</span>
              <span>Fan → Friend → Freak</span>
            </div>
            <div className="space-y-6">
              <h2 className="max-w-2xl font-display text-5xl font-semibold leading-tight">
                Lock in on <span className="text-brand-yellow">Meal Comboz</span> starting at $5.79
              </h2>
              <p className="max-w-xl text-lg text-white/80">
                Craft your sandwich, stack the fries, pour the shake. Mobile-only drops earn 2x Loaded points after 10PM.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/order" className="btn-primary bg-white text-brand-dark shadow-white/40 hover:shadow-brand-yellow/40">
                Start an order
              </Link>
              <Link
                href="/myloaded"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10"
              >
                View rewards
              </Link>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-6 rounded-[40px] border border-brand-red/15 bg-white/80 p-8 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Your bag</p>
              <h3 className="font-display text-2xl font-semibold text-brand-dark">Ready when you are</h3>
            </div>
            <span className="rounded-full bg-brand-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
              0 items
            </span>
          </div>
          <p className="text-sm text-brand-dark/70">
            Sign in to sync your previous favorites and re-order in under 30 seconds. LoadedPay customers earn 1.25x points when
            you finish checkout in the app.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-brand-red/10 bg-white/70 px-5 py-4">
              <span className="font-semibold text-brand-dark">Scan in-store barcode</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Wallet ready</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-brand-red/10 bg-white/70 px-5 py-4">
              <span className="font-semibold text-brand-dark">Schedule curbside pickup</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">5:15 PM</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-brand-red/10 bg-white/70 px-5 py-4">
              <span className="font-semibold text-brand-dark">LoadedPay balance</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">$48.20</span>
            </div>
          </div>
          <Link
            href="/pay"
            className="inline-flex items-center justify-center rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-brand-dark/30 transition hover:bg-brand-red"
          >
            Go to payment hub
          </Link>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-red">Featured menus</p>
            <h3 className="font-display text-3xl font-semibold text-brand-dark">Cravings unlocked</h3>
          </div>
          <Link href="/order" className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark underline-offset-4 hover:underline">
            View full menu
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredCombos.map((combo) => (
            <article key={combo.id} className="group relative overflow-hidden rounded-[32px] border border-brand-red/15 bg-white/90 shadow-lg">
              <div className="relative h-48">
                <Image src={combo.image} alt={combo.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="space-y-2 p-6">
                <h4 className="font-display text-xl font-semibold text-brand-dark">{combo.title}</h4>
                <p className="text-sm text-brand-dark/70">{combo.description}</p>
                <Link href="/order" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                  Start customizing →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
        <div className="space-y-4 rounded-[32px] border border-brand-red/15 bg-white/80 p-8 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Offers & boosts</p>
              <h3 className="font-display text-2xl font-semibold text-brand-dark">On your account</h3>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">Tap to activate</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
        <div className="space-y-6 rounded-[32px] border border-brand-red/15 bg-white/80 p-8 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Find your loaded</p>
              <h3 className="font-display text-2xl font-semibold text-brand-dark">Store finder</h3>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">2 nearby</span>
          </div>
          <StoreFinder />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-red">Loaded in the community</p>
            <h3 className="font-display text-3xl font-semibold text-brand-dark">Every reward counts</h3>
          </div>
          <p className="max-w-2xl text-sm text-brand-dark/70">
            Partnering with local crews keeps our late-night energy real. Swipe through the latest events we fuel and the stories
            shaping the Loaded fan base.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {communityStories.map((story) => (
            <article key={story.id} className="group overflow-hidden rounded-[32px] border border-brand-red/15 bg-white/90 shadow-lg">
              <div className="relative h-64">
                <Image src={story.image} alt={story.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="space-y-2 p-6">
                <h4 className="font-display text-2xl font-semibold text-brand-dark">{story.title}</h4>
                <p className="text-sm text-brand-dark/70">{story.blurb}</p>
                <button className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">See recap</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[40px] border border-brand-red/20 bg-brand-dark text-white shadow-2xl">
        <div className="grid gap-10 p-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-yellow">Loaded graffiti wall</p>
            <h3 className="font-display text-4xl font-semibold leading-tight">Feeling Freaky? Drop your art, join the crew.</h3>
            <p className="text-sm text-white/70">
              Submit your artwork to be featured on next season's packaging and street posters. Winners earn Freak-level status for
              a full year.
            </p>
            <button className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark shadow-lg shadow-brand-yellow/30">
              Submit artwork
            </button>
          </div>
          <div className="relative h-64 rounded-[32px] bg-[radial-gradient(circle_at_top,_#ffe45c,_#ed1c24_60%,_#1a1a1a_100%)]">
            <Image
              src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80"
              alt="Loaded graffiti"
              fill
              className="mix-blend-screen object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
