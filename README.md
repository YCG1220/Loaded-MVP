# Loaded MVP

Next.js 14 demo for the Loaded ordering experience. It ships with the customer app, secure admin console, and Supabase-ready API routes.

## Run locally
1. Install Node.js 18 or newer.
2. Copy the sample environment file and fill in your Supabase keys (and optional Stripe keys).
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies and start the dev server.
   ```bash
   npm install
   npm run dev
   ```
4. Visit http://localhost:3000 for the guest app. Export `SESSION_SECRET` and `NEXT_PUBLIC_ADMIN_SECRET` in the same shell before opening http://localhost:3000/admin.

## Provision Supabase (optional but recommended)
1. Create a project at https://supabase.com and open the SQL editor.
2. Paste the contents of `supabase/schema.sql` and run the script to create tables, policies, and helper routines.
3. Keep the generated service role key and database URL in `.env.local`; never commit secrets to source control.

## Useful scripts
- `npm run dev` – start the web app
- `npm run lint` – lint the codebase
- `npm run build` – create a production build
- `npm run backfill:dry` – call the stock backfill function without applying changes
- `npm run backfill:apply` – call the stock backfill function with apply mode (requires production secrets)

## Project structure
- `app/` – Next.js routes for the guest experience and admin console
- `components/` – UI building blocks shared across the app
- `src/lib/` – Supabase helpers, environment validation, and domain services
- `src/types/` – TypeScript models for menu, loyalty, and Supabase
- `supabase/` – SQL schema used to seed new environments
- `scripts/` – Utility scripts such as the stock backfill runner
- `functions/` – Supabase Edge Function sources

