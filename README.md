# Loaded MVP – Next.js demo

This repository contains a production-ready MVP for the Loaded fast-food ordering experience. It includes:

- **Guest app** with the five core tabs (Home, Order, MyLoaded, Pay, More)
- **Admin console** for menu, modifier, inventory, offer, reward, and order management
- **API routes** backed by Supabase-ready schemas and secure admin headers
- **Tailwind-based design system** matching the proposal brand guide
- **Checkout workflow** with loyalty point accrual and modifier support

## 1. Prerequisites

- Node.js 18+
- pnpm, npm, or yarn (examples use `npm`)
- Supabase project (free tier is fine)
- Stripe test account (optional; enables future payments integration)

## 2. Environment variables

Copy `.env.example` → `.env.local` and populate with your secrets.

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (store securely) |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret (Project Settings → API) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional; Stripe test publishable key |
| `STRIPE_SECRET_KEY` | Optional; Stripe test secret key |
| `STRIPE_WEBHOOK_SECRET` | Optional; Stripe webhook signing secret |
| `SESSION_SECRET` | Long random string (32+ chars) used to protect admin APIs |
| `NEXT_PUBLIC_ADMIN_SECRET` | Match `SESSION_SECRET`; used by browser-based admin UI |
| `SUPABASE_DB_URL` | Optional; Postgres connection string used by local scripts |
| `SUPABASE_DB_URL_STAGING` | Optional; staging connection string for CI/CD |
| `SUPABASE_DB_URL_PROD` | Optional; production connection string for CI/CD |
| `SUPABASE_EDGE_FUNCTION_URL` | Optional; URL to the deployed `run-backfill` edge function |

> ⚠️ **Never** commit `.env.local`. Use 1Password/Secrets Manager when sharing with engineers.

## 3. Database schema (Supabase)

1. Sign in to Supabase → SQL Editor.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Run the script. It creates tables for menu items, modifier groups, inventory, offers, rewards, orders, and RLS policies.
4. Confirm the trigger `handle_new_user` exists under _Database → Functions_.

> ℹ️ The same schema lives in `db/migrations/` for teams preferring repeatable SQL migrations via `psql` or Supabase CLI.

## 4. Install & run

### Windows quick-start (PowerShell)

1. **Download the repository**
   - On GitHub choose **Code → Download ZIP**.
   - Open the ZIP in File Explorer and click **Extract all…**. Pick a location such as `C:\Users\YOURNAME\Projects\Loaded-MVP`.
   - You must extract the archive first—PowerShell cannot `cd` into a `.zip` file.

2. **Open PowerShell in the extracted folder**
   - In File Explorer, right-click the extracted `Loaded-MVP` folder and choose **Open in Terminal** (or copy the path from the address bar).
   - In PowerShell run:
     ```powershell
     cd "C:\Users\YOURNAME\Projects\Loaded-MVP"
     ```
     Replace the path with wherever you extracted the folder. The quotes let Windows handle spaces in the path.

3. **Install Node.js if you have not already**
   - Download from [nodejs.org](https://nodejs.org) or, if Chocolatey is installed, run `choco install nodejs-lts` from an elevated PowerShell window.
   - Restart PowerShell and confirm with `node --version` (should be `18.x` or newer) and `npm --version`.

4. **Set up environment variables**
   ```powershell
   copy .env.example .env.local
   notepad .env.local
   ```
   Paste the Supabase and optional Stripe secrets into `.env.local`. Save the file and close Notepad.

5. **Install dependencies and start the dev server**
   ```powershell
   npm install
   npm run dev
   ```
   When you see `ready - started server on 0.0.0.0:3000`, open <http://localhost:3000> in your browser.

6. **Admin console on Windows**
   - In the same PowerShell session export the shared secret values before navigating to `/admin`:
     ```powershell
     $env:SESSION_SECRET = "your-long-random-secret"
     $env:NEXT_PUBLIC_ADMIN_SECRET = "your-long-random-secret"
     ```
   - Use the same value in both variables and in `.env.local`. Keep the PowerShell window open while testing.

7. **Stop the dev server**
   - Press `Ctrl + C` in PowerShell. Confirm with `Y` if prompted.

> 💡 **Tip:** If PowerShell ever says a path is not recognized, double-check that you extracted the ZIP and that the path you passed to `cd` matches the folder location exactly.

```bash
npm install
npm run dev
```

- Local dev server: http://localhost:3000
- Admin console: http://localhost:3000/admin (requires `NEXT_PUBLIC_ADMIN_SECRET` header; see below)
- Stock backfill console: http://localhost:3000/admin/db-backfill

## 5. Admin authentication

All admin API routes require the `SESSION_SECRET`. The browser admin console forwards `NEXT_PUBLIC_ADMIN_SECRET` in an `x-admin-secret` header.

For testing locally:

```bash
export SESSION_SECRET="paste-your-secret"
export NEXT_PUBLIC_ADMIN_SECRET="paste-your-secret"
```

For API clients / automation, send:

```http
GET /api/admin/menu
x-admin-secret: paste-your-secret
```

## 6. Security checklist

- `next-secure-headers` enforces CSP, HSTS, and referrer policies.
- Admin APIs validate a shared secret and use Supabase service role credentials server-side only.
- Supabase RLS policies lock guest access to public data and service-role to admin routes.
- Environment variables validated via `zod` (`src/lib/env.ts`). Missing values throw during boot.
- Stripe secrets are optional but segregated for future payment flows.
- Database credentials (`SUPABASE_DB_URL*`) stay in environment secrets only—never commit them to the repo.

## 7. Key directories

```
app/
  page.tsx             → Guest home
  order/               → Ordering + cart experience
  myloaded/            → Loyalty hub
  pay/                 → LoadedPay wallet
  more/                → Utility links
  admin/               → Secure admin console
  api/                 → Route handlers (Supabase powered)
components/
  layout/              → Global providers + navigation
  menu/                → Ordering UI widgets
  admin/               → CRUD forms & reusable table
  shared/              → Offer cards, store finder, loyalty bar
db/migrations/         → SQL migrations for schema + backfill routine
functions/run-backfill/ → Supabase Edge Function source
scripts/run_backfill.js → Node runner for the stock backfill function
src/
  lib/                 → Supabase clients, env helpers
  types/               → TypeScript models for menu + database
supabase/schema.sql    → Run in Supabase SQL editor
```

## 8. Checkout + loyalty demo

- `app/api/orders/checkout` accepts cart payloads, stores the order, and awards points.
- Use the browser console to simulate a checkout:

```js
await fetch("/api/orders/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: "<valid-auth-user-uuid>",
    store_id: "store-001",
    fulfillment_method: "pickup",
    subtotal: 24.5,
    tax: 2.02,
    total: 26.52,
    points_redeemed: 0,
    items: [
      {
        menu_item_id: "<menu-item-uuid>",
        quantity: 1,
        modifiers: { toppings: ["Candied Bacon", "Crispy Onions"] },
      },
    ],
  }),
});
```

Replace UUIDs with actual IDs from Supabase.

## 9. Stock backfill workflow

- **Admin UI:** `/admin/db-backfill` lists recent runs, previews up to 200 diffs, and requires an `APPLY` confirmation for live updates.
- **CLI:** `npm run backfill:dry` (or `node scripts/run_backfill.js --apply`) targets the database referenced by `DATABASE_URL`/`SUPABASE_DB_URL`.
- **Edge function:** deploy `functions/run-backfill` to Supabase and set `SUPABASE_EDGE_FUNCTION_URL` so the admin UI can call it.
- **CI:** `.github/workflows/db-migrations-and-backfill.yml` validates migrations, uploads dry-run diffs on PRs, applies to staging/prod on `main`, and exposes a guarded `workflow_dispatch` for production runs. Required secrets: `SUPABASE_DB_URL`, `SUPABASE_DB_URL_STAGING`, `SUPABASE_DB_URL_PROD`, and `SUPABASE_SERVICE_ROLE_KEY` (for edge deployments).

## 10. Production hardening notes

- Swap the shared-secret admin guard for Supabase Auth or SSO before shipping.
- Configure Stripe + webhook to move from “demo” to real payments.
- Add rate limiting (e.g., Upstash, Vercel Edge Middleware) to admin endpoints.
- Replace mock data in `src/lib/mock-data.ts` with Supabase queries once tables are populated.
- Add integration tests (Playwright) for checkout and admin CRUD workflows.

## 11. Developer handoff tips

- Zip the project or push to GitHub and enable Vercel Preview for designers.
- Provide `.env.sample` with placeholder strings—not secrets.
- Share Supabase SQL export plus ERD screenshot for backend engineers.
- Walk through `/admin` so stakeholders see modifier + inventory tooling in action.

---
Questions? Ping the Loaded platform team or drop issues in this repo so we can iterate with developers quickly.
