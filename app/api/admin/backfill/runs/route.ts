import { assertAdminRequest } from "../../../../../src/lib/admin-auth";
import { getAdminSupabaseClient } from "../../../../../src/lib/supabase-admin";
import { jsonResponse, errorResponse } from "../../../../../src/lib/api-response";

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from("backfill_runs")
      .select("id, run_name, started_at, completed_at, details")
      .order("started_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return jsonResponse(data ?? []);
  } catch (error) {
    return errorResponse(error, 401);
  }
}
