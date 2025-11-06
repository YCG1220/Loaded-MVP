import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const offerSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(3).max(16),
  name: z.string().min(2),
  description: z.string().optional(),
  discount_type: z.enum(["amount", "percent", "bonus_points"]).optional(),
  discount_value: z.number().optional(),
  bonus_points: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_active: z.boolean().optional(),
});

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("offers").select("*");
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
    const payload = offerSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("offers").insert(payload).select().single();
    if (error) throw error;
    return jsonResponse(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
