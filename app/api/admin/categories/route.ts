import { z } from "zod";
import { getAdminSupabaseClient } from "../../../../src/lib/supabase-admin";
import { assertAdminRequest } from "../../../../src/lib/admin-auth";
import { jsonResponse, errorResponse } from "../../../../src/lib/api-response";

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  sort_order: z.number().optional(),
});

export async function GET() {
  try {
    assertAdminRequest();
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
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
    const payload = categorySchema.parse(body);
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from("categories").insert(payload).select().single();
    if (error) throw error;
    return jsonResponse(data, { status: 201 });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
