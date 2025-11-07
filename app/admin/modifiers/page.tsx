"use client";

import { DataTable } from "../../../components/admin/data-table";
import { ModifierGroupForm } from "../../../components/admin/modifier-group-form";
import { ModifierForm } from "../../../components/admin/modifier-form";

interface ModifierGroupRow {
  id: string;
  name: string;
  description: string | null;
  min_select: number | null;
  max_select: number | null;
  is_required: boolean;
}

interface ModifierRow {
  id: string;
  group_id: string | null;
  name: string;
  price_delta: number | null;
  calories: number | null;
  grams: number | null;
  is_default: boolean;
}

export default function AdminModifiersPage() {
  return (
    <div className="space-y-6">
      <DataTable<ModifierGroupRow>
        title="Modifier groups"
        description="Control choices such as sizes, toppings, and required selections."
        endpoint="/api/admin/modifier-groups"
        columns={[
          { key: "name", label: "Group" },
          { key: "description", label: "Description" },
          { key: "min_select", label: "Min" },
          { key: "max_select", label: "Max" },
          { key: "is_required", label: "Required", render: (item) => (item.is_required ? "Yes" : "No") },
        ]}
        form={<ModifierGroupForm />}
      />
      <DataTable<ModifierRow>
        title="Modifiers"
        description="Add-ons with price deltas, gram amounts, and nutrition data."
        endpoint="/api/admin/modifiers"
        columns={[
          { key: "name", label: "Modifier" },
          { key: "group_id", label: "Group" },
          { key: "price_delta", label: "Price", render: (item) => `$${(item.price_delta ?? 0).toFixed(2)}` },
          { key: "grams", label: "Grams" },
          { key: "calories", label: "Calories" },
          { key: "is_default", label: "Default", render: (item) => (item.is_default ? "Yes" : "No") },
        ]}
        form={<ModifierForm />}
      />
    </div>
  );
}
