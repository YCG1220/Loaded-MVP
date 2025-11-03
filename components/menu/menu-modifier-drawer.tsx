"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MenuItem, ModifierGroup } from "../../src/types/menu";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface MenuModifierDrawerProps {
  item: MenuItem;
  onAdd: (item: MenuItem, selections: Record<string, string[]>) => void;
  children: React.ReactNode;
}

export function MenuModifierDrawer({ item, onAdd, children }: MenuModifierDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const toggleOption = (group: ModifierGroup, optionId: string) => {
    setSelections((prev) => {
      const existing = prev[group.id] ?? [];
      const isSelected = existing.includes(optionId);
      let next = existing;
      if (isSelected) {
        next = existing.filter((id) => id !== optionId);
      } else if (!group.maxSelect || existing.length < group.maxSelect) {
        next = [...existing, optionId];
      } else if (group.maxSelect === 1) {
        next = [optionId];
      }
      return { ...prev, [group.id]: next };
    });
  };

  const handleSubmit = () => {
    onAdd(item, selections);
    setSelections({});
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="text-left">
        {children}
      </button>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-y-full sm:translate-y-0 sm:scale-95"
                enterTo="translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="translate-y-0 sm:scale-100"
                leaveTo="translate-y-full sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl border border-brand-red/10 bg-white p-6 text-left shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="font-display text-2xl font-semibold text-brand-dark">{item.name}</Dialog.Title>
                      <p className="mt-1 text-sm text-brand-dark/70">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full border border-brand-red/20 bg-white/80 p-2 text-brand-dark transition hover:border-brand-red"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {item.modifierGroups?.map((group) => (
                    <div key={group.id} className="mt-6 space-y-3 rounded-2xl border border-brand-red/10 bg-brand-cream/50 p-4">
                      <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/60">
                        <span>{group.name}</span>
                        <span>
                          {group.minSelect ?? 0} - {group.maxSelect ?? "∞"} select
                        </span>
                      </div>
                      <div className="space-y-3">
                        {group.options.map((option) => {
                          const selected = selections[group.id]?.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleOption(group, option.id)}
                              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selected ? "border-brand-red bg-white text-brand-dark shadow" : "border-brand-red/20 bg-white/80 text-brand-dark/80"}`}
                            >
                              <div>
                                <p className="text-sm font-semibold text-brand-dark">{option.name}</p>
                                {(option.grams || option.calories) && (
                                  <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/40">
                                    {option.grams ? `${option.grams}g` : ""}
                                    {option.grams && option.calories ? " • " : ""}
                                    {option.calories ? `${option.calories} cal` : ""}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm font-semibold text-brand-red">
                                {option.priceDelta > 0 ? `+$${option.priceDelta.toFixed(2)}` : "Included"}
                                <PlusIcon className="h-5 w-5" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-lg font-semibold text-brand-dark">${item.price.toFixed(2)}</span>
                    <button type="button" onClick={handleSubmit} className="btn-primary">
                      Add to cart
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
