import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../../src/lib/api-response";

const updateSchema = z.object({
  code: z.string().min(3).max(16).optional(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  discount_type: z.enum(["amount", "percent", "bonus_points"]).optional(),
  discount_value: z.number().optional(),
  bonus_points: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_active: z.boolean().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    assertAdminRequest();
    const body = await request.json();
    const payload = updateSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("offers").update(payload).eq("id", params.id).select().single();
    if (error) throw error;
    return jsonResponse(data);
  } catch (error) {
    return errorResponse(error, 400);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { error } = await supabase.from("offers").delete().eq("id", params.id);
    if (error) throw error;
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
