"use client";

import { DataTable } from "../../../components/admin/data-table";
import { MenuForm } from "../../../components/admin/menu-form";
import { CategoryForm } from "../../../components/admin/category-form";

interface MenuItemRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  calories: number | null;
  category_id: string | null;
  is_active: boolean;
}

interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
}

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      <DataTable<MenuItemRow>
        title="Menu items"
        description="Manage guest-facing products including price, imagery, and availability."
        endpoint="/api/admin/menu"
        columns={[
          { key: "name", label: "Item" },
          { key: "description", label: "Description" },
          { key: "price", label: "Price", render: (item) => `$${item.price.toFixed(2)}` },
          { key: "calories", label: "Calories" },
          { key: "category_id", label: "Category" },
          { key: "is_active", label: "Active", render: (item) => (item.is_active ? "Yes" : "No") },
        ]}
        form={<MenuForm />}
      />
      <DataTable<CategoryRow>
        title="Categories"
        description="Define ordering buckets that power the guest navigation."
        endpoint="/api/admin/categories"
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "sort_order", label: "Sort order" },
        ]}
        form={<CategoryForm />}
      />
    </div>
  );
}
