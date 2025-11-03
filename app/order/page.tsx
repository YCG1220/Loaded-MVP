"use client";

import { useMemo, useState } from "react";
import { Tab } from "@headlessui/react";
import { categories, menuItems } from "../../src/lib/mock-data";
import { MenuList } from "../../components/menu/menu-list";
import { CartSummary } from "../../components/menu/cart-summary";
import type { MenuItem as MenuItemType } from "../../src/types/menu";

interface CartItem {
  item: MenuItemType;
  modifiers: Record<string, string[]>;
}

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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),320px]">
      <div className="card space-y-6">
        <Tab.Group>
          <Tab.List className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Tab
                key={category.id}
                className={({ selected }) =>
                  `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${selected ? "bg-brand-red text-white shadow" : "bg-white/60 text-brand-dark/60 hover:bg-white"}`
                }
              >
                {category.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6 space-y-6">
            {categories.map((category) => (
              <Tab.Panel key={category.id} className="space-y-4">
                <div className="section-title">
                  <span className="h-2 w-2 rounded-full bg-brand-red" />
                  {category.name}
                </div>
                <MenuList items={itemsByCategory[category.id] ?? []} onAddItem={handleAddItem} />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
      <CartSummary cart={cart} />
    </div>
  );
}
