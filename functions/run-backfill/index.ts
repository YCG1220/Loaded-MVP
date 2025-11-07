import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase configuration for edge function.");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: { run_name?: string; batch_limit?: number; apply?: boolean };
  try {
    payload = await req.json();
  } catch (_error) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const runName = typeof payload.run_name === "string" && payload.run_name.trim().length > 0
    ? payload.run_name.trim()
    : `edge-${new Date().toISOString()}`;
  const batchLimit = typeof payload.batch_limit === "number" && payload.batch_limit > 0
    ? Math.floor(payload.batch_limit)
    : 1000;
  const apply = Boolean(payload.apply);

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await adminClient.rpc("run_stock_levels_backfill", {
    run_name: runName,
    p_batch_limit: batchLimit,
    p_apply: apply,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const waitUntil = (globalThis as unknown as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime?.waitUntil;
  if (waitUntil) {
    waitUntil(
      (async () => {
        await adminClient
          .from("backfill_runs")
          .select("id")
          .eq("id", data)
          .maybeSingle();
      })(),
    );
  }

  return new Response(
    JSON.stringify({ run_id: data, run_name: runName, apply, batch_limit: batchLimit }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
