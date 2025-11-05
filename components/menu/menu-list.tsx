import Image from "next/image";
import { MenuItem } from "../../src/types/menu";
import { MenuModifierDrawer } from "./menu-modifier-drawer";

interface MenuListProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem, modifiers: Record<string, string[]>) => void;
}

export function MenuList({ items, onAddItem }: MenuListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MenuModifierDrawer key={item.id} item={item} onAdd={onAddItem}>
          <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-brand-red/15 bg-white/90 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative h-44 overflow-hidden">
              <Image
                src={`${item.imageUrl}&auto=format&fit=crop&w=700&q=80`}
                alt={item.name}
                fill
                className="object-cover object-center transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">
                {item.calories ? `${item.calories} cal` : "Loaded"}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-semibold text-brand-dark">{item.name}</h3>
                  <p className="text-sm text-brand-dark/70">{item.description}</p>
                </div>
                <span className="rounded-full bg-brand-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">
                <span>Tap to customize</span>
                <span className="text-brand-red">Add +</span>
              </div>
            </div>
          </article>
        </MenuModifierDrawer>
      ))}
    </div>
  );
}
