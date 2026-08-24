import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  ClientWithStats,
  DashboardStats,
  Expense,
  Invoice,
  InvoiceWithItems,
  Organization,
  Payment,
  Product,
  Profile,
  TeamMember,
} from "./types";

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7); // YYYY-MM
}

function lastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return (data as Profile) ?? null;
}

// ---------- Invoices (org-scoped) ----------

export async function getInvoices(orgId: string): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data as Invoice[]) ?? [];
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();
  if (!invoice) return null;
  const [{ data: items }, { data: payments }] = await Promise.all([
    supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at"),
    supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", id)
      .order("payment_date", { ascending: false }),
  ]);
  const paidAmount =
    payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
  return {
    ...(invoice as Invoice),
    items: (items as InvoiceWithItems["items"]) ?? [],
    paid_amount: paidAmount,
    payments: (payments as Payment[]) ?? [],
  };
}

// ---------- Clients with aggregated stats (org-scoped) ----------

export async function getClientsWithStats(orgId: string): Promise<ClientWithStats[]> {
  const supabase = await createClient();
  const [{ data: clients }, { data: invoices }] = await Promise.all([
    supabase.from("clients").select("*").eq("organization_id", orgId).order("name"),
    supabase.from("invoices").select("client_id,total,status").eq("organization_id", orgId),
  ]);

  const statsByClient = new Map<
    string,
    { count: number; invoiced: number; paid: number }
  >();
  for (const inv of invoices ?? []) {
    if (!inv.client_id) continue;
    const s = statsByClient.get(inv.client_id) ?? {
      count: 0,
      invoiced: 0,
      paid: 0,
    };
    s.count += 1;
    s.invoiced += Number(inv.total);
    if (inv.status === "paid") s.paid += Number(inv.total);
    statsByClient.set(inv.client_id, s);
  }

  return ((clients as ClientWithStats[]) ?? []).map((c) => {
    const s = statsByClient.get(c.id) ?? { count: 0, invoiced: 0, paid: 0 };
    return {
      ...c,
      invoice_count: s.count,
      total_invoiced: s.invoiced,
      total_paid: s.paid,
      outstanding: Math.max(0, s.invoiced - s.paid),
    };
  });
}

// ---------- Products / Inventory (org-scoped) ----------

export async function getProducts(orgId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

// ---------- Expenses (org-scoped) ----------

export async function getExpenses(orgId: string): Promise<Expense[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("organization_id", orgId)
    .order("expense_date", { ascending: false });
  return (data as Expense[]) ?? [];
}

// ---------- Dashboard (org-scoped) ----------

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  const supabase = await createClient();
  const [invoicesRes, expensesRes, clientsRes, productsRes] = await Promise.all([
    supabase.from("invoices").select("*").eq("organization_id", orgId).order("created_at", { ascending: false }),
    supabase.from("expenses").select("*").eq("organization_id", orgId).order("expense_date", { ascending: false }),
    supabase.from("clients").select("id", { count: "exact" }).eq("organization_id", orgId),
    supabase.from("products").select("*").eq("organization_id", orgId),
  ]);

  const invoices = (invoicesRes.data as Invoice[]) ?? [];
  const expenses = (expensesRes.data as Expense[]) ?? [];
  const products = (productsRes.data as Product[]) ?? [];

  const currentMonth = monthKey(new Date().toISOString());

  let totalRevenue = 0;
  let outstanding = 0;
  let overdueCount = 0;
  let revenueThisMonth = 0;

  for (const inv of invoices) {
    if (inv.status === "paid") {
      totalRevenue += Number(inv.total);
      if (monthKey(inv.issue_date) === currentMonth)
        revenueThisMonth += Number(inv.total);
    } else if (inv.status === "pending" || inv.status === "overdue") {
      outstanding += Number(inv.total);
      if (inv.due_date < new Date().toISOString().slice(0, 10))
        overdueCount += 1;
    }
  }

  let expensesThisMonth = 0;
  for (const exp of expenses) {
    if (monthKey(exp.expense_date) === currentMonth)
      expensesThisMonth += Number(exp.amount);
  }

  // Build 6-month revenue vs expense series
  const months = lastNMonths(6);
  const monthly_series = months.map((m) => ({
    month: m,
    revenue: invoices
      .filter((i) => i.status === "paid" && monthKey(i.issue_date) === m)
      .reduce((s, i) => s + Number(i.total), 0),
    expenses: expenses
      .filter((e) => monthKey(e.expense_date) === m)
      .reduce((s, e) => s + Number(e.amount), 0),
  }));

  const lowStockProducts = products.filter(
    (p) => p.track_stock && p.stock_quantity <= p.low_stock_threshold
  );

  return {
    total_revenue: totalRevenue,
    outstanding,
    overdue_count: overdueCount,
    expenses_this_month: expensesThisMonth,
    revenue_this_month: revenueThisMonth,
    net_profit_this_month: revenueThisMonth - expensesThisMonth,
    invoice_count: invoices.length,
    client_count: clientsRes.count ?? 0,
    product_count: products.length,
    low_stock_count: lowStockProducts.length,
    monthly_series,
    recent_invoices: invoices.slice(0, 8),
    recent_expenses: expenses.slice(0, 5),
    low_stock_products: lowStockProducts.slice(0, 5),
  };
}

// ---------- Team (org-scoped) ----------

export interface TeamData {
  organization: Organization | null;
  members: TeamMember[];
}

export async function getTeamData(orgId: string): Promise<TeamData> {
  const supabase = await createClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .maybeSingle();

  let members: TeamMember[] = [];
  if (organization) {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: true });
    members = (data as TeamMember[]) ?? [];
  }

  return { organization: (organization as Organization) ?? null, members };
}

// ---------- Reports (org-scoped) ----------

export interface ReportData {
  monthly_series: { month: string; revenue: number; expenses: number; profit: number }[];
  expense_by_category: { category: string; amount: number }[];
  top_clients: { name: string; total: number; invoice_count: number }[];
  totals: {
    revenue: number;
    expenses: number;
    profit: number;
    outstanding: number;
    invoice_count: number;
    paid_count: number;
  };
}

export async function getReportData(orgId: string): Promise<ReportData> {
  const [invoices, expenses, clients] = await Promise.all([
    getInvoices(orgId),
    getExpenses(orgId),
    getClientsWithStats(orgId),
  ]);

  const months = lastNMonths(12);
  const monthly_series = months.map((m) => {
    const revenue = invoices
      .filter((i) => i.status === "paid" && monthKey(i.issue_date) === m)
      .reduce((s, i) => s + Number(i.total), 0);
    const exp = expenses
      .filter((e) => monthKey(e.expense_date) === m)
      .reduce((s, e) => s + Number(e.amount), 0);
    return { month: m, revenue, expenses: exp, profit: revenue - exp };
  });

  const catMap = new Map<string, number>();
  for (const e of expenses) {
    catMap.set(e.category, (catMap.get(e.category) ?? 0) + Number(e.amount));
  }
  const expense_by_category = [...catMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const top_clients = [...clients]
    .sort((a, b) => b.total_invoiced - a.total_invoiced)
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      total: c.total_invoiced,
      invoice_count: c.invoice_count,
    }));

  const revenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.total), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((s, i) => s + Number(i.total), 0);

  return {
    monthly_series,
    expense_by_category,
    top_clients,
    totals: {
      revenue,
      expenses: totalExpenses,
      profit: revenue - totalExpenses,
      outstanding,
      invoice_count: invoices.length,
      paid_count: invoices.filter((i) => i.status === "paid").length,
    },
  };
}
