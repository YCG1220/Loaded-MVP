import Image from "next/image";
import { MenuItem } from "../../src/types/menu";
import { MenuModifierDrawer } from "./menu-modifier-drawer";

interface MenuListProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem, modifiers: Record<string, string[]>) => void;
}

export function MenuList({ items, onAddItem }: MenuListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <MenuModifierDrawer key={item.id} item={item} onAdd={onAddItem}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-red/10 bg-white/80 shadow-lg shadow-brand-red/10 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative h-44">
              <Image src={`${item.imageUrl}&auto=format&fit=crop&w=600&q=80`} alt={item.name} fill className="object-cover object-center transition group-hover:scale-105" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-brand-dark">{item.name}</h3>
                  <p className="text-sm text-brand-dark/70">{item.description}</p>
                </div>
                <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              {item.calories && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/60">{item.calories} cal</p>}
              <div className="mt-auto text-right">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/40">Tap to customize</span>
              </div>
            </div>
          </article>
        </MenuModifierDrawer>
      ))}
    </div>
  );
}
