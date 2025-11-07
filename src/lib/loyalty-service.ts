import { createServerSupabaseClient } from "./supabase-server";
import { LoyaltyContent, OfferSummary, RewardSummary } from "../types/loyalty";

export async function fetchLoyaltyContent(): Promise<LoyaltyContent> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { rewards: [], offers: [] };
  }

  const supabase = createServerSupabaseClient();

  const { data: rewardRows, error: rewardError } = await supabase
    .from("rewards")
    .select("id, name, description, points_cost, is_active, updated_at")
    .order("points_cost", { ascending: true });

  if (rewardError) {
    console.error("Failed to fetch rewards", rewardError);
  }

  const { data: offerRows, error: offerError } = await supabase
    .from("offers")
    .select(
      "id, code, name, description, discount_type, discount_value, bonus_points, start_date, end_date, is_active"
    )
    .order("start_date", { ascending: false, nullsFirst: false });

  if (offerError) {
    console.error("Failed to fetch offers", offerError);
  }

  const rewards: RewardSummary[] = (rewardRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    pointsCost: Number(row.points_cost ?? 0),
    isActive: Boolean(row.is_active),
    updatedAt: row.updated_at ?? undefined,
  }));

  const offers: OfferSummary[] = (offerRows ?? []).map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description ?? undefined,
    discountType: row.discount_type,
    discountValue: row.discount_value !== null ? Number(row.discount_value) : null,
    bonusPoints: row.bonus_points !== null ? Number(row.bonus_points) : null,
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: Boolean(row.is_active),
  }));

  return { rewards, offers };
}
