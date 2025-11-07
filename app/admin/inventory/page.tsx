"use client";

import { DataTable } from "../../../components/admin/data-table";
import { InventoryForm } from "../../../components/admin/inventory-form";

interface InventoryRow {
  id: string;
  name: string;
  sku: string | null;
  unit: string;
  grams_per_unit: number | null;
  cost_per_unit: number | null;
  quantity_on_hand: number | null;
  reorder_threshold: number | null;
}

export default function AdminInventoryPage() {
  return (
    <DataTable<InventoryRow>
      title="Inventory items"
      description="Track kitchen-facing specs including grams per portion and par levels."
      endpoint="/api/admin/inventory"
      columns={[
        { key: "name", label: "Item" },
        { key: "sku", label: "SKU" },
        { key: "unit", label: "Unit" },
        { key: "grams_per_unit", label: "Grams/unit" },
        { key: "cost_per_unit", label: "Cost", render: (item) => (item.cost_per_unit ? `$${item.cost_per_unit.toFixed(2)}` : "—") },
        { key: "quantity_on_hand", label: "On hand" },
        { key: "reorder_threshold", label: "Reorder at" },
      ]}
      form={<InventoryForm />}
    />
  );
}
