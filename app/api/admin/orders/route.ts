import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("orders").select("*,order_items(*)").order("placed_at", { ascending: false });
    if (error) throw error;
    return jsonResponse(data ?? []);
  } catch (error) {
    return errorResponse(error, 401);
  }
}
