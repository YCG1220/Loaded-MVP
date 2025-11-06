import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../../src/lib/api-response";

const updateSchema = z.object({
  category_id: z.string().optional(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
  calories: z.number().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    assertAdminRequest();
    const body = await request.json();
    const payload = updateSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("menu_items").update(payload).eq("id", params.id).select().single();
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
    const { error } = await supabase.from("menu_items").delete().eq("id", params.id);
    if (error) throw error;
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
