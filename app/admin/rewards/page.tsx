import { DataTable } from "../../../components/admin/data-table";
import { RewardForm } from "../../../components/admin/reward-form";

interface RewardRow {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  is_active: boolean;
}

export default function AdminRewardsPage() {
  return (
    <DataTable<RewardRow>
      title="Rewards"
      description="Define point-based perks that appear in the MyLoaded hub."
      endpoint="/api/admin/rewards"
      columns={[
        { key: "name", label: "Reward" },
        { key: "description", label: "Description" },
        { key: "points_cost", label: "Points" },
        { key: "is_active", label: "Active", render: (item) => (item.is_active ? "Yes" : "No") },
      ]}
      form={<RewardForm />}
    />
  );
}
