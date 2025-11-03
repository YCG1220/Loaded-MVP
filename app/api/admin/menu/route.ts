import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const menuItemSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
  calories: z.number().optional(),
});

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("menu_items").select("*").order("updated_at", { ascending: false });
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
    const payload = menuItemSchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("menu_items").insert(payload).select().single();
    if (error) throw error;
    return jsonResponse(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
