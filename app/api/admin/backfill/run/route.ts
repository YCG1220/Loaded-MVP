import { z } from "zod";
import { assertAdminRequest } from "../../../../../src/lib/admin-auth";
import { getAdminSupabaseClient } from "../../../../../src/lib/supabase-admin";
import { jsonResponse, errorResponse } from "../../../../../src/lib/api-response";

const payloadSchema = z.object({
  runName: z.string().min(1).optional(),
  batchLimit: z.number().int().positive().max(50000).optional(),
  apply: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    assertAdminRequest();
    const raw = await request.json().catch(() => ({}));
    const payload = payloadSchema.parse({
      runName: raw.runName ?? raw.run_name,
      batchLimit: raw.batchLimit ?? raw.batch_limit,
      apply: raw.apply,
    });

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.rpc("run_stock_levels_backfill", {
      run_name: payload.runName ?? `admin-${new Date().toISOString()}`,
      p_batch_limit: payload.batchLimit ?? 1000,
      p_apply: payload.apply ?? false,
    });

    if (error) throw error;

    return jsonResponse({
      run_id: data,
      apply: payload.apply ?? false,
      batchLimit: payload.batchLimit ?? 1000,
    });
  } catch (error) {
    return errorResponse(error, 400);
  }
}
