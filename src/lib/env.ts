import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_ADMIN_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().min(32),
  SUPABASE_DB_URL: z.string().url().optional(),
  SUPABASE_EDGE_FUNCTION_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Missing or invalid environment variables. Check .env file.");
  }
  cached = {
    ...result.data,
    NEXT_PUBLIC_ADMIN_SECRET: result.data.NEXT_PUBLIC_ADMIN_SECRET ?? result.data.SESSION_SECRET,
  } as Env;
  return cached;
}
