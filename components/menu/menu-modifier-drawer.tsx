"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MenuItem, ModifierGroup } from "../../src/types/menu";

interface MenuModifierDrawerProps {
  item: MenuItem;
  onAdd: (item: MenuItem, selections: Record<string, string[]>) => void;
  children: React.ReactNode;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function buildInitialSelections(groups: ModifierGroup[]) {
  const result: Record<string, string[]> = {};

  groups.forEach((group) => {
    const defaults = group.options.filter((option) => option.isDefault).map((option) => option.id);
    const minRequired = Math.max(group.minSelect ?? 0, group.isRequired ? 1 : 0);
    let selected = defaults.slice(0, group.maxSelect || defaults.length || minRequired || undefined);

    if (selected.length < minRequired) {
      const fallback = group.options.slice(0, minRequired).map((option) => option.id);
      selected = Array.from(new Set([...selected, ...fallback])).slice(
        0,
        group.maxSelect && group.maxSelect > 0 ? group.maxSelect : undefined
      );
    }

    result[group.id] = selected;
  });

  return result;
}

export function MenuModifierDrawer({ item, onAdd, children }: MenuModifierDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const modifierGroups = useMemo(() => {
    return [...(item.modifierGroups ?? [])].sort((a, b) => {
      const sequenceA = a.sequence ?? 0;
      const sequenceB = b.sequence ?? 0;
      if (sequenceA !== sequenceB) return sequenceA - sequenceB;
      return a.name.localeCompare(b.name);
    });
  }, [item.modifierGroups]);

  const initialSelections = useMemo(() => buildInitialSelections(modifierGroups), [modifierGroups]);

  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections);
      setCurrentStep(0);
      setValidationMessage(null);
    }
  }, [initialSelections, isOpen, item.id]);

  const totalSteps = modifierGroups.length;
  const currentGroup = modifierGroups[currentStep];

  const calculateOptionPrice = (groupId: string) => {
    const selectedIds = selections[groupId] ?? [];
    const group = modifierGroups.find((g) => g.id === groupId);
    if (!group) return 0;
    return selectedIds.reduce((sum, optionId) => {
      const option = group.options.find((opt) => opt.id === optionId);
      return sum + (option?.priceDelta ?? 0);
    }, 0);
  };

  const currentPrice = useMemo(() => {
    const modifiersTotal = modifierGroups.reduce((sum, group) => sum + calculateOptionPrice(group.id), 0);
    return item.price + modifiersTotal;
  }, [item.price, modifierGroups, selections]);

  const isGroupComplete = (group: ModifierGroup) => {
    const selected = selections[group.id] ?? [];
    const required = Math.max(group.minSelect ?? 0, group.isRequired ? 1 : 0);
    return selected.length >= required;
  };

  const firstIncompleteIndex = () => modifierGroups.findIndex((group) => !isGroupComplete(group));

  const handleClose = () => {
    setIsOpen(false);
    setValidationMessage(null);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleToggleOption = (group: ModifierGroup, optionId: string) => {
    setSelections((prev) => {
      const existing = prev[group.id] ?? [];
      const isSelected = existing.includes(optionId);
      let next = existing;

      if (isSelected) {
        next = existing.filter((id) => id !== optionId);
      } else {
        if (group.maxSelect === 1) {
          next = [optionId];
        } else if (group.maxSelect && group.maxSelect > 0 && existing.length >= group.maxSelect) {
          return prev;
        } else {
          next = [...existing, optionId];
        }
      }

      setValidationMessage(null);
      return { ...prev, [group.id]: next };
    });
  };

  const handleNext = () => {
    if (!currentGroup) {
      handleSubmit();
      return;
    }

    if (!isGroupComplete(currentGroup)) {
      const required = Math.max(currentGroup.minSelect ?? 0, currentGroup.isRequired ? 1 : 0);
      setValidationMessage(`Choose at least ${required || 1} option${required === 1 ? "" : "s"} in ${currentGroup.name}.`);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setValidationMessage(null);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      handleClose();
    } else {
      setCurrentStep((prev) => Math.max(0, prev - 1));
      setValidationMessage(null);
    }
  };

  const handleSubmit = () => {
    const incompleteIndex = firstIncompleteIndex();
    if (incompleteIndex !== -1) {
      const group = modifierGroups[incompleteIndex];
      const required = Math.max(group.minSelect ?? 0, group.isRequired ? 1 : 0);
      setCurrentStep(incompleteIndex);
      setValidationMessage(`Choose at least ${required || 1} option${required === 1 ? "" : "s"} in ${group.name}.`);
      return;
    }

    onAdd(item, selections);
    setIsOpen(false);
    setValidationMessage(null);
  };

  const canNavigateToStep = (targetIndex: number) => {
    if (targetIndex <= currentStep) return true;
    return modifierGroups.slice(0, targetIndex).every((group) => isGroupComplete(group));
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className="text-left">
        {children}
      </button>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <Dialog.Panel className="w-full max-w-3xl overflow-hidden rounded-[40px] border border-brand-red/10 bg-white text-left shadow-2xl">
                  <div className="relative bg-brand-cream/60">
                    {item.imageUrl && (
                      <div className="relative h-52 w-full overflow-hidden">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover object-center" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                        <span>{totalSteps > 0 ? `Item ${currentStep + 1}/${totalSteps}` : "Customize"}</span>
                        <div className="flex items-center gap-2 text-white/80">
                          <span>{currencyFormatter.format(currentPrice)}</span>
                          {item.calories && <span>• {item.calories} cal</span>}
                        </div>
                      </div>
                      <h3 className="font-display text-2xl font-semibold">{item.name}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/40 p-2 text-white transition hover:bg-black/60"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6 p-6 md:p-8">
                    {totalSteps > 0 && (
                      <nav className="flex flex-wrap items-center gap-3">
                        {modifierGroups.map((group, index) => {
                          const completed = isGroupComplete(group);
                          return (
                            <button
                              key={group.id}
                              type="button"
                              onClick={() => {
                                if (canNavigateToStep(index)) {
                                  setCurrentStep(index);
                                  setValidationMessage(null);
                                } else {
                                  setValidationMessage("Complete previous steps to continue.");
                                }
                              }}
                              className={clsx(
                                "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition",
                                index === currentStep
                                  ? "border-brand-red bg-brand-red text-white shadow-brand-red/30"
                                  : completed
                                  ? "border-brand-red/20 bg-brand-cream text-brand-red"
                                  : "border-brand-red/20 bg-white text-brand-dark/60"
                              )}
                            >
                              {completed ? <CheckIcon className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-brand-red/40" />} {group.name}
                            </button>
                          );
                        })}
                      </nav>
                    )}

                    {validationMessage && (
                      <div className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                        {validationMessage}
                      </div>
                    )}

                    {currentGroup ? (
                      <div className="space-y-5">
                        <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">Build this step</p>
                            <h4 className="font-display text-2xl font-semibold text-brand-dark">{currentGroup.name}</h4>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/50">
                            {currentGroup.maxSelect && currentGroup.maxSelect > 0
                              ? `Choose up to ${currentGroup.maxSelect}`
                              : currentGroup.minSelect || currentGroup.isRequired
                              ? `Choose at least ${Math.max(currentGroup.minSelect, 1)}`
                              : "Optional"}
                          </span>
                        </header>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {currentGroup.options.map((option) => {
                            const selected = (selections[currentGroup.id] ?? []).includes(option.id);
                            const priceLabel = option.priceDelta > 0 ? `+${currencyFormatter.format(option.priceDelta)}` : "Included";
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleToggleOption(currentGroup, option.id)}
                                className={clsx(
                                  "flex w-full flex-col gap-3 rounded-3xl border px-4 py-4 text-left shadow-sm transition",
                                  selected
                                    ? "border-brand-red bg-brand-red/5 shadow-brand-red/20"
                                    : "border-brand-red/15 bg-white hover:border-brand-red/40"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-base font-semibold text-brand-dark">{option.name}</p>
                                  <span className="rounded-full bg-brand-red/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-red">
                                    {priceLabel}
                                  </span>
                                </div>
                                {(option.grams || option.calories) && (
                                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark/40">
                                    {option.grams ? `${option.grams}g` : ""}
                                    {option.grams && option.calories ? " • " : ""}
                                    {option.calories ? `${option.calories} cal` : ""}
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-brand-dark/60">This item is ready to add to your bag.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-brand-red/10 bg-brand-cream/70 p-6 text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark">
                    <div className="flex items-center justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{currencyFormatter.format(currentPrice)}</span>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-red/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark transition hover:border-brand-red/40"
                      >
                        <ArrowLeftIcon className="h-4 w-4" /> {currentStep === 0 ? "Cancel" : "Previous item"}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-brand-red/40 transition hover:translate-y-[-2px]"
                      >
                        {currentStep === totalSteps - 1 || totalSteps === 0 ? "Add to bag" : "Next item"}
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
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
