"use client";

import { DataTable } from "../../../components/admin/data-table";
import { OfferForm } from "../../../components/admin/offer-form";

interface OfferRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: string | null;
  discount_value: number | null;
  bonus_points: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export default function AdminOffersPage() {
  return (
    <DataTable<OfferRow>
      title="Offers"
      description="Launch promo codes and targeted deals for acquisition and retention."
      endpoint="/api/admin/offers"
      columns={[
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "discount_type", label: "Type" },
        { key: "discount_value", label: "Value" },
        { key: "bonus_points", label: "Bonus pts" },
        { key: "start_date", label: "Starts" },
        { key: "end_date", label: "Ends" },
        { key: "is_active", label: "Active", render: (item) => (item.is_active ? "Yes" : "No") },
      ]}
      form={<OfferForm />}
    />
  );
}
