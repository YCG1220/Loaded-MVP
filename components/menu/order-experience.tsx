"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { MenuList } from "./menu-list";
import type { Category, MenuItem } from "../../src/types/menu";
import { CartSummary } from "./cart-summary";

interface CartEntry {
  item: MenuItem;
  modifiers: Record<string, string[]>;
}

interface OrderExperienceProps {
  categories: Category[];
  menuItems: MenuItem[];
}

export function OrderExperience({ categories, menuItems }: OrderExperienceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"pickup" | "delivery">("pickup");
  const [lastAddedItem, setLastAddedItem] = useState<MenuItem | null>(null);
  const orderedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }, [categories]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(() => orderedCategories[0]?.id ?? null);

  useEffect(() => {
    if (!orderedCategories.length) {
      setActiveCategoryId(null);
      return;
    }

    const hasActiveCategory = orderedCategories.some((category) => category.id === activeCategoryId);
    if (!hasActiveCategory) {
      setActiveCategoryId(orderedCategories[0].id);
    }
  }, [orderedCategories, activeCategoryId]);

  const itemsByCategory = useMemo(() => {
    const group = orderedCategories.reduce<Record<string, MenuItem[]>>((acc, category) => {
      acc[category.id] = [];
      return acc;
    }, {});

    menuItems.forEach((item) => {
      if (!item.categoryId) return;
      if (!group[item.categoryId]) {
        group[item.categoryId] = [];
      }
      group[item.categoryId].push(item);
    });

    Object.values(group).forEach((list) =>
      list.sort((a, b) => {
        const orderA = a.sortOrder ?? 0;
        const orderB = b.sortOrder ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      })
    );

    return group;
  }, [menuItems, orderedCategories]);

  const filteredItems = (categoryId: string | null) => {
    if (!categoryId) return [] as MenuItem[];
    const items = itemsByCategory[categoryId] ?? [];
    if (!searchTerm.trim()) return items;
    const query = searchTerm.trim().toLowerCase();
    return items.filter((item) =>
      [item.name, item.description].some((field) => field?.toLowerCase().includes(query))
    );
  };

  const activeCategory = activeCategoryId
    ? orderedCategories.find((category) => category.id === activeCategoryId) ?? null
    : null;
  const activeItems = filteredItems(activeCategory?.id ?? null);

  const activeCategoryImage = activeCategory?.imageUrl || activeItems[0]?.imageUrl;
  const heroImage =
    activeCategoryImage && activeCategoryImage.length > 0
      ? activeCategoryImage
      : "https://images.unsplash.com/photo-1606755962773-0e7d925d2b9f?auto=format&fit=crop&w=900&q=80";

  const categoryBadge = activeCategory ? activeCategory.name : "Menu";

  const handleAddItem = (item: MenuItem, modifiers: Record<string, string[]>) => {
    setCart((prev) => [...prev, { item, modifiers }]);
    setLastAddedItem(item);
  };

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.8fr),minmax(320px,420px)] xl:items-start">
      <div className="space-y-8">
        <article className="relative overflow-hidden rounded-[40px] border border-brand-red/15 bg-brand-red text-white shadow-2xl">
          <div className="absolute inset-y-0 right-0 hidden h-full w-1/2 opacity-80 lg:block">
            <Image src={heroImage} alt="Loaded combo meal" fill className="object-cover object-center" priority />
          </div>
          <div className="relative grid gap-8 p-8 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)] lg:gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
                <span>{fulfillmentMethod === "pickup" ? "Pickup" : "Delivery"}</span>
                <span className="flex items-center gap-1 text-white/70">
                  <MapPinIcon className="h-4 w-4" />
                  Store #744
                </span>
              </div>
              <h1 className="font-display text-4xl font-semibold leading-tight lg:text-5xl">
                {activeCategory ? `Explore ${activeCategory.name}` : "Lock in on Loaded meal combos starting at $5."}
              </h1>
              <p className="text-sm text-white/80 lg:text-base">
                Browse every category with the same freaky-fast layout. Customize builds, stack modifiers, and keep your cart
                synced across pickup or delivery.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod("pickup")}
                  className={clsx(
                    "rounded-full border px-4 py-2 transition",
                    fulfillmentMethod === "pickup"
                      ? "border-white bg-white text-brand-red"
                      : "border-white/30 bg-white/10"
                  )}
                >
                  Pickup 8-12m
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod("delivery")}
                  className={clsx(
                    "rounded-full border px-4 py-2 transition",
                    fulfillmentMethod === "delivery"
                      ? "border-white bg-white text-brand-red"
                      : "border-white/30 bg-white/10"
                  )}
                >
                  Delivery 25-35m
                </button>
                <span className="rounded-full border border-white/30 px-4 py-2">Earn 1.25x pts</span>
              </div>
            </div>
            <div className="space-y-5 rounded-[28px] border border-white/20 bg-white/15 p-6 backdrop-blur">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                <span>Current store</span>
                <button type="button" className="inline-flex items-center gap-1 text-white transition hover:text-yellow-200">
                  Change
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">Store #744</p>
                <p className="text-white/80">799 N Leavitt Rd, Amherst OH 44001</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Freak tip: Save your go-to build under Favorites to reorder in two taps.
              </div>
            </div>
          </div>
        </article>

        <div className="space-y-6 rounded-[32px] border border-brand-red/15 bg-white/85 p-6 shadow-xl shadow-brand-red/10 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-red">Choose your craving</p>
              <h2 className="font-display text-2xl font-semibold text-brand-dark">Full menu, zero guesswork.</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
              <HeartIcon className="h-4 w-4" /> Favorites
            </div>
          </div>
          <label className="group flex items-center gap-3 rounded-full border border-brand-red/15 bg-white px-5 py-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-brand-dark/50" />
            <input
              type="search"
              placeholder="Search our menu"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 border-none bg-transparent text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red"
              >
                Clear
              </button>
            )}
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              className="flex flex-col items-start gap-3 rounded-3xl border border-brand-red/10 bg-brand-cream/80 p-4 text-left text-sm font-semibold text-brand-dark transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                <ClockIcon className="h-4 w-4" /> Recent orders
              </span>
              <span className="text-brand-dark/70">Re-run your latest freak session.</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-start gap-3 rounded-3xl border border-brand-red/10 bg-brand-cream/80 p-4 text-left text-sm font-semibold text-brand-dark transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                <MapPinIcon className="h-4 w-4" /> Delivery exclusives
              </span>
              <span className="text-brand-dark/70">Unlock app-only drops & specials.</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-start gap-3 rounded-3xl border border-brand-red/10 bg-brand-cream/80 p-4 text-left text-sm font-semibold text-brand-dark transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                <HeartIcon className="h-4 w-4" /> Favorites
              </span>
              <span className="text-brand-dark/70">Pull in your saved combos.</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px),minmax(0,1fr)] lg:items-start">
          <aside className="space-y-4 rounded-[28px] border border-brand-red/15 bg-white/95 p-5 shadow-brand-red/10 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Categories</h3>
              <span className="rounded-full bg-brand-red/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-red">
                {categoryBadge}
              </span>
            </div>
            <div className="flex flex-col divide-y divide-brand-red/10">
              {orderedCategories.map((category) => {
                const firstItemImage = (itemsByCategory[category.id] ?? []).find((item) => item.imageUrl)?.imageUrl;
                const previewImage = category.imageUrl || firstItemImage || "";
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={clsx(
                      "flex w-full items-center gap-4 px-3 py-4 text-left transition", 
                      activeCategoryId === category.id
                        ? "rounded-2xl bg-brand-red text-white shadow-lg shadow-brand-red/40"
                        : "hover:bg-brand-cream/80"
                    )}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-brand-cream">
                      {previewImage ? (
                        <Image src={previewImage} alt={category.name} fill className="object-cover object-center" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-dark/60">
                          {category.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={clsx(
                          "font-display text-base font-semibold",
                          activeCategoryId === category.id ? "text-white" : "text-brand-dark"
                        )}
                      >
                        {category.name}
                      </p>
                      {category.description && (
                        <p
                          className={clsx(
                            "text-sm", 
                            activeCategoryId === category.id ? "text-white/80" : "text-brand-dark/70"
                          )}
                        >
                          {category.description}
                        </p>
                      )}
                    </div>
                    <ChevronRightIcon
                      className={clsx(
                        "h-5 w-5 flex-shrink-0", 
                        activeCategoryId === category.id ? "text-white" : "text-brand-dark/40"
                      )}
                    />
                  </button>
                );
              })}
              {!orderedCategories.length && (
                <p className="px-3 py-6 text-sm text-brand-dark/60">Add categories from the admin panel to populate the menu.</p>
              )}
            </div>
          </aside>

          <div className="space-y-6 rounded-[32px] border border-brand-red/15 bg-white/95 p-6 shadow-xl shadow-brand-red/10">
            <header className="flex flex-col gap-2 border-b border-brand-red/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                  {activeCategory ? activeCategory.name : "Menu"}
                </p>
                <h2 className="font-display text-3xl font-semibold text-brand-dark">
                  {activeCategory?.description || "Pick a bundle, then go freak mode."}
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60 underline-offset-4 hover:text-brand-red hover:underline"
              >
                View nutrition
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            </header>

            <MenuList items={activeItems} onAddItem={handleAddItem} />

            {activeItems.length === 0 && (
              <div className="rounded-3xl border border-dashed border-brand-red/30 bg-brand-cream/60 p-6 text-sm text-brand-dark/60">
                No items match your search in this category. Try adjusting the filter or switch categories.
              </div>
            )}
          </div>
        </div>
      </div>

      <CartSummary cart={cart} lastAddedItem={lastAddedItem} />
    </section>
  );
}
