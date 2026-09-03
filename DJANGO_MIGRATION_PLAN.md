# BizPilot — Django REST API Backend Migration & SaaS Feature Plan

**Date:** September 3, 2026
**Status:** Proposed
**Prerequisite reading:** `SaaS_REPORT.md`

---

## 0. Executive Summary

BizPilot today is a **Next.js monolith on Supabase**: all business logic lives in React Server
Components / Server Actions (`app/(dashboard)/actions*.ts`, `lib/erp/queries.ts`), authorization
lives in Postgres RLS policies, and auth lives in Supabase Auth (GoTrue).

This plan moves the backend to a **Django + Django REST Framework (DRF) API server**, while the
existing Next.js 16 app is kept as the frontend and converted from Server Actions/Supabase-SDK
calls to a typed HTTP API client.

Four workstreams:

| # | Workstream | Goal |
|---|------------|------|
| A | **Backend migration** | Replace Supabase client + server actions with Django REST API |
| B | **Subscription management** | Plans, entitlements, limits, Stripe lifecycle, trials |
| C | **User access & Organization management** | Custom org-defined roles with granular permissions (RBAC v2) |
| D | **AI platform** | Provider-agnostic AI gateway + a prioritized backlog of AI features |

**Target timeline:** ~14 weeks, with the API serving the existing frontend from Week 6.

---

## 1. Current State Audit (what exists in this repo today)

### 1.1 Data model (from `supabase/migrations/`)
- `organizations` — business profile, invoice snapshot defaults, `stripe_customer_id`, `stripe_subscription_id`
- `team_members` — org membership: `user_id`, `email`, `name`, `role` (`owner|admin|editor|viewer`), `department`, `status` (`active|pending`), `invited_by` — unique on `(organization_id, lower(email))`
- `clients`, `products`, `invoices`, `invoice_items`, `expenses`, `payments` — each with `organization_id` (`invoice_items` derived via parent invoice)
- `subscriptions` — one per org: Stripe IDs, `status`, `price_id`, `cancel_at_period_end`, period bounds
- `profiles` — per-user preferences + default invoice settings

### 1.2 Authorization today (RLS)
- SQL helpers: `is_org_member()`, `can_write_org()` (editor+), `can_manage_org()` (admin+), `org_role()`
- RLS on every table; role rank `viewer(0) < editor(1) < admin(2) < owner(3)` — mirrored in TS in `lib/erp/org.ts`
- Invite claim: pending `team_members` row claimed by matching JWT email at login (`claimPendingInvites`)

### 1.3 Backend surface to be replaced (Server Actions → REST endpoints)
- CRUD: clients, products, invoices (+items, payments), expenses, team invites, org settings
- Queries: dashboard stats, reports (`getReportData`), global search, per-client stats
- Stripe: `createCheckoutSession`, `createCustomerPortalSession`, `syncCheckoutSession`, webhook
- AI: `generateInvoiceItems` (editor+), `askBizPilot` (any member)

### 1.4 Pain points that motivate the migration
1. Business logic split between TS server actions and RLS — hard to unit test
2. RLS cannot express **custom, org-defined roles** (§5) — fixed 4-role ladder only
3. No plan-limit enforcement layer yet (report #10 / §4.1)
4. AI key/model logic buried in one Next module; no usage metering or quotas
5. A real REST API is prerequisite for report items #23 (public API) and #22 (mobile/PWA)

<!-- APPEND -->
