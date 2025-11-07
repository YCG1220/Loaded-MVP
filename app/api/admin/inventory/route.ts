import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const inventorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  sku: z.string().optional(),
  unit: z.string().min(1),
  grams_per_unit: z.number().optional(),
  cost_per_unit: z.number().optional(),
  quantity_on_hand: z.number().optional(),
  reorder_threshold: z.number().optional(),
});

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("inventory_items").select("*");
    if (error) throw error;
    return jsonResponse(data ?? []);
  } catch (error) {
    return errorResponse(error, 401);
  }
}

export async function POST(request: Request) {
  try {
    assertAdminRequest();
    const body = await request.json();
    const payload = inventorySchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("inventory_items").insert(payload).select().single();
    if (error) throw error;
    return jsonResponse(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
