import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
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
    <div className="divide-y divide-brand-red/10">
      {items.map((item) => (
        <MenuModifierDrawer key={item.id} item={item} onAdd={onAddItem}>
          <article className="group flex w-full items-center gap-4 py-5 transition hover:bg-brand-cream/60">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl bg-brand-cream/70 sm:h-24 sm:w-24">
              {item.imageUrl ? (
                <Image
                  src={buildImageUrl(item.imageUrl)}
                  alt={item.name}
                  fill
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              ) : (
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
                </span>
              </div>
            </div>
          </article>
        </MenuModifierDrawer>
      ))}
      {!items.length && (
        <div className="py-6 text-sm text-brand-dark/60">No menu items available yet.</div>
      )}
    </div>
  );
}
