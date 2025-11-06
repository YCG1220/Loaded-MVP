<<<<<<< HEAD
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

=======
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

> ⚠️ **Never** commit `.env.local`. Use 1Password/Secrets Manager when sharing with engineers.

## 3. Database schema (Supabase)

1. Sign in to Supabase → SQL Editor.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Run the script. It creates tables for menu items, modifier groups, inventory, offers, rewards, orders, and RLS policies.
4. Confirm the trigger `handle_new_user` exists under _Database → Functions_.

## 4. Install & run

```bash
npm install
npm run dev
```

- Local dev server: http://localhost:3000
- Admin console: http://localhost:3000/admin (requires `NEXT_PUBLIC_ADMIN_SECRET` header; see below)

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

## 9. Production hardening notes

- Swap the shared-secret admin guard for Supabase Auth or SSO before shipping.
- Configure Stripe + webhook to move from “demo” to real payments.
- Add rate limiting (e.g., Upstash, Vercel Edge Middleware) to admin endpoints.
- Replace mock data in `src/lib/mock-data.ts` with Supabase queries once tables are populated.
- Add integration tests (Playwright) for checkout and admin CRUD workflows.

## 10. Developer handoff tips

- Zip the project or push to GitHub and enable Vercel Preview for designers.
- Provide `.env.sample` with placeholder strings—not secrets.
- Share Supabase SQL export plus ERD screenshot for backend engineers.
- Walk through `/admin` so stakeholders see modifier + inventory tooling in action.

---
Questions? Ping the Loaded platform team or drop issues in this repo so we can iterate with developers quickly.
>>>>>>> origin/main
