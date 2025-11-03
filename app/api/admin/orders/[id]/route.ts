import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../../src/lib/api-response";

const updateSchema = z.object({
  status: z.enum(["pending", "in_progress", "ready", "completed", "cancelled"]).optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    assertAdminRequest();
    const body = await request.json();
    const payload = updateSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("orders").update(payload).eq("id", params.id).select().single();
    if (error) throw error;
    return jsonResponse(data);
  } catch (error) {
    return errorResponse(error, 400);
  }
}
