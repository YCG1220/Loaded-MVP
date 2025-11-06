import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../../src/lib/api-response";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  points_cost: z.number().positive().optional(),
  is_active: z.boolean().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    assertAdminRequest();
    const body = await request.json();
    const payload = updateSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("rewards").update(payload).eq("id", params.id).select().single();
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
    const { error } = await supabase.from("rewards").delete().eq("id", params.id);
    if (error) throw error;
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
