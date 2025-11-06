import Image from "next/image";
<<<<<<< HEAD
import { ChevronRightIcon } from "@heroicons/react/24/outline";
=======
>>>>>>> origin/main
import { MenuItem } from "../../src/types/menu";
import { MenuModifierDrawer } from "./menu-modifier-drawer";

interface MenuListProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem, modifiers: Record<string, string[]>) => void;
}

function buildImageUrl(url: string) {
  if (!url) return "";
  return url.includes("?") ? `${url}&auto=format&fit=crop&w=700&q=80` : `${url}?auto=format&fit=crop&w=700&q=80`;
}

export function MenuList({ items, onAddItem }: MenuListProps) {
  return (
<<<<<<< HEAD
    <div className="divide-y divide-brand-red/10">
      {items.map((item) => (
        <MenuModifierDrawer key={item.id} item={item} onAdd={onAddItem}>
          <article className="group flex w-full items-center gap-4 py-5 transition hover:bg-brand-cream/60">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl bg-brand-cream/70 sm:h-24 sm:w-24">
=======
    <div className="space-y-5">
      {items.map((item) => (
        <MenuModifierDrawer key={item.id} item={item} onAdd={onAddItem}>
          <article className="group flex w-full items-stretch gap-4 rounded-[32px] border border-brand-red/10 bg-white/95 p-4 shadow transition hover:-translate-y-1 hover:shadow-2xl sm:p-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl bg-brand-cream/70 sm:h-28 sm:w-28">
>>>>>>> origin/main
              {item.imageUrl ? (
                <Image
                  src={buildImageUrl(item.imageUrl)}
                  alt={item.name}
                  fill
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              ) : (
<<<<<<< HEAD
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-brand-dark/50">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-1 items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-brand-dark sm:text-xl">{item.name}</h3>
                {item.description && <p className="text-sm text-brand-dark/70">{item.description}</p>}
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-dark/50">
                  Tap to customize
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <span className="text-base font-semibold text-brand-dark">${item.price.toFixed(2)}</span>
                {item.calories && (
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">
                    {item.calories} cal
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                  Add
                  <ChevronRightIcon className="h-4 w-4" />
=======
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-brand-dark/50">
                  {item.name.charAt(0)}
                </div>
              )}
              {item.calories && (
                <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-brand-dark">
                  {item.calories} cal
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-semibold text-brand-dark sm:text-xl">{item.name}</h3>
                  {item.description && <p className="text-sm text-brand-dark/70">{item.description}</p>}
                </div>
                <span className="self-start rounded-full bg-brand-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-brand-red">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-dark/60">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-red/30" /> Tap to customize
                </span>
                <span className="flex items-center gap-1 text-brand-red">
                  Add
                  <span className="text-base leading-none">+</span>
>>>>>>> origin/main
                </span>
              </div>
            </div>
          </article>
        </MenuModifierDrawer>
      ))}
<<<<<<< HEAD
      {!items.length && (
        <div className="py-6 text-sm text-brand-dark/60">No menu items available yet.</div>
      )}
=======
>>>>>>> origin/main
    </div>
  );
}
