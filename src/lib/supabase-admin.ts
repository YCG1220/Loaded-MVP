import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./env";
import { Database } from "../types/database";

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getAdminSupabaseClient() {
  if (client) return client;
  const env = getEnv();
  client = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return client;
}
