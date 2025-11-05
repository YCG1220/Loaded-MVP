"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { categories, menuItems } from "../../src/lib/mock-data";
import { MenuList } from "../../components/menu/menu-list";
import { CartSummary } from "../../components/menu/cart-summary";
import type { MenuItem as MenuItemType } from "../../src/types/menu";

interface CartItem {
  item: MenuItemType;
  modifiers: Record<string, string[]>;
}

const filters = ["All items", "Fan favorites", "LoadedPay deals", "Late night"];

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const itemsByCategory = useMemo(() => {
    return categories.reduce<Record<string, MenuItemType[]>>((acc, category) => {
      acc[category.id] = menuItems.filter((item) => item.categoryId === category.id);
      return acc;
    }, {});
  }, []);

  const handleAddItem = (item: MenuItemType, modifiers: Record<string, string[]>) => {
    setCart((prev) => [...prev, { item, modifiers }]);
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr),minmax(0,380px)]">
        <div className="space-y-8">
          <article className="relative overflow-hidden rounded-[40px] border border-brand-red/15 bg-white shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1600&q=80"
              alt="My order hero"
              fill
              className="object-cover"
              priority
            />
            <div className="relative grid gap-6 p-10 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] lg:items-center">
              <div className="space-y-4">
                <span className="inline-flex w-fit rounded-full bg-brand-red px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                  My order
                </span>
                <h1 className="font-display text-4xl font-semibold text-brand-dark">
                  Ultimate toppers built to freak out your fries.
                </h1>
                <p className="text-sm text-brand-dark/70">
                  Start with crispy shoestrings, stack drizzles, sprinkle crunch. Save your builds, reorder, and earn Freak-tier status faster.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
                  <span className="rounded-full border border-brand-red/20 px-3 py-2">In-store pickup 8-12m</span>
                  <span className="rounded-full border border-brand-red/20 px-3 py-2">Delivery 25-35m</span>
                  <span className="rounded-full border border-brand-red/20 px-3 py-2">Earn 1.25x pts</span>
                </div>
              </div>
              <div className="space-y-4 rounded-[28px] border border-brand-red/15 bg-white/85 p-6 shadow-lg shadow-brand-red/10">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Promo boosters</p>
                <ul className="space-y-3 text-sm text-brand-dark/70">
                  <li className="flex items-center justify-between rounded-2xl border border-brand-red/10 bg-white px-4 py-3">
                    <span>SHAKE50 applied</span>
                    <span className="text-brand-red">+50 pts</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl border border-brand-red/10 bg-white px-4 py-3">
                    <span>LoadedPay</span>
                    <span className="text-brand-dark/60">1.25x multiplier</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl border border-brand-red/10 bg-white px-4 py-3">
                    <span>Fan streak</span>
                    <span className="text-brand-red">Day 4</span>
                  </li>
                </ul>
                <button className="inline-flex w-full items-center justify-center rounded-full bg-brand-red px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg">
                  Manage offers
                </button>
              </div>
            </div>
          </article>

          <div className="rounded-[32px] border border-brand-red/15 bg-white/85 p-6 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
              {filters.map((filter) => (
                <span key={filter} className="rounded-full border border-brand-red/15 bg-white px-4 py-2 text-brand-dark/70">
                  {filter}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <Tab.Group>
                <Tab.List className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <Tab
                      key={category.id}
                      className={({ selected }) =>
                        `rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.32em] transition ${
                          selected
                            ? "bg-brand-red text-white shadow-lg shadow-brand-red/40"
                            : "bg-white text-brand-dark/60 border border-brand-red/10 hover:bg-brand-red/10"
                        }`
                      }
                    >
                      {category.name}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-8 space-y-8">
                  {categories.map((category) => (
                    <Tab.Panel key={category.id} className="space-y-4">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">{category.name}</p>
                          <h2 className="font-display text-3xl font-semibold text-brand-dark">{category.description}</h2>
                        </div>
                        <button className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60 underline-offset-4 hover:text-brand-red hover:underline">
                          View nutrition
                        </button>
                      </div>
                      <MenuList items={itemsByCategory[category.id] ?? []} onAddItem={handleAddItem} />
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>

        <CartSummary cart={cart} />
      </section>
    </div>
  );
}
