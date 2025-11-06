import { assertAdminRequest } from "../../../../../../src/lib/admin-auth";
import { getAdminSupabaseClient } from "../../../../../../src/lib/supabase-admin";
import { jsonResponse, errorResponse } from "../../../../../../src/lib/api-response";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from("stock_backfill_diffs")
      .select("id, inventory_item_id, location, previous_quantity, new_quantity, computed_at")
      .eq("backfill_run_id", context.params.id)
      .order("computed_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return jsonResponse(data ?? []);
  } catch (error) {
    return errorResponse(error, 401);
  }
}
