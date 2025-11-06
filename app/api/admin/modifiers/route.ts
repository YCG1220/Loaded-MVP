import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const modifierSchema = z.object({
  id: z.string().uuid().optional(),
  group_id: z.string().uuid(),
  name: z.string().min(2),
  price_delta: z.number().optional().default(0),
  calories: z.number().optional(),
  grams: z.number().optional(),
  is_default: z.boolean().optional(),
});

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("modifiers").select("*");
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
    const payload = modifierSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("modifiers").insert(payload).select().single();
    if (error) throw error;
    return jsonResponse(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
