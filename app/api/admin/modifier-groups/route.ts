import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const groupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  min_select: z.number().min(0).optional(),
  max_select: z.number().min(1).optional(),
  is_required: z.boolean().optional(),
});

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("modifier_groups").select("*");
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
    const payload = groupSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("modifier_groups").insert(payload).select().single();
    if (error) throw error;
    return jsonResponse(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
