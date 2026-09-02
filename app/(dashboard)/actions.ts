"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_ORG_COOKIE,
  getMemberships,
  requireRole,
} from "@/lib/erp/org";
import type { InvoiceStatus, PaymentMethod, TeamRole } from "@/lib/erp/types";

function str(fd: FormData, key: string, fallback = "") {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;
}

function num(fd: FormData, key: string, fallback = 0) {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
}

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

// ===================== ORGANIZATIONS =====================

export async function switchOrganization(orgId: string): Promise<ActionResult> {
  try {
    const ctxList = await getMemberships();
    if (!ctxList.some((m) => m.org.id === orgId))
      return { ok: false, error: "You are not a member of that organization." };

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_ORG_COOKIE, orgId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to switch organization." };
  }
}

export async function createOrganization(
  name: string,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const supabase = await createClient();
    const clean = name.trim().slice(0, 80);
    if (!clean) return { ok: false, error: "Enter a business name." };

    const { data: user } = await supabase.auth.getUser();

    const { data: org, error } = await supabase
      .from("organizations")
      .insert({ owner_id: userId, name: clean })
      .select("id")
      .single();
    if (error || !org) return { ok: false, error: error?.message ?? "Failed." };

    // RLS lets us insert our own membership as owner
    const { error: memberError } = await supabase.from("team_members").insert({
      organization_id: org.id,
      user_id: userId,
      email: user.user?.email ?? "",
      name: "",
      role: "owner" as TeamRole,
      status: "active",
      joined_at: new Date().toISOString(),
    });
    if (memberError)
      return { ok: false, error: memberError.message };

    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_ORG_COOKIE, org.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    revalidatePath("/", "layout");
    return { ok: true, id: org.id };
  } catch {
    return { ok: false, error: "Failed to create organization." };
  }
}

export async function updateOrganization(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    const supabase = await createClient();

    const name = str(formData, "name");
    if (!name) return { ok: false, error: "Business name is required." };

    const { error } = await supabase
      .from("organizations")
      .update({
        name,
        company_email: str(formData, "company_email"),
        company_address: str(formData, "company_address"),
        company_phone: str(formData, "company_phone"),
        default_currency: str(formData, "default_currency", "USD"),
        default_tax_rate: num(formData, "default_tax_rate"),
        default_notes: str(formData, "default_notes"),
        default_terms: str(formData, "default_terms"),
      })
      .eq("id", ctx.org.id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/", "layout");
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed." };
  }
}

// ===================== EXPENSES =====================

export async function createExpense(formData: FormData) {
  const ctx = await requireRole("editor");
  const supabase = await createClient();

  const title = str(formData, "title");
  if (!title) return;

  await supabase.from("expenses").insert({
    user_id: ctx.member.user_id,
    organization_id: ctx.org.id,
    title,
    category: str(formData, "category", "other"),
    vendor: str(formData, "vendor"),
    amount: num(formData, "amount"),
    currency: str(formData, "currency", "USD"),
    expense_date: str(formData, "expense_date", new Date().toISOString().slice(0, 10)),
    payment_method: (str(formData, "payment_method", "cash") || "cash") as PaymentMethod,
    notes: str(formData, "notes"),
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function deleteExpense(id: string) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase.from("expenses").delete().eq("id", id);
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

// ===================== INVOICES =====================

export async function markInvoicePaid(invoiceId: string) {
  const ctx = await requireRole("editor");
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id,total,currency,status")
    .eq("id", invoiceId)
    .single();
  if (!invoice || invoice.status === "paid") return;

  // Record a payment for the remaining balance (respects partial payments)
  const { data: existing } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoiceId);
  const alreadyPaid = (existing ?? []).reduce((s, p) => s + Number(p.amount), 0);
  const remaining = Math.max(0, Number(invoice.total) - alreadyPaid);

  if (remaining > 0) {
    await supabase.from("payments").insert({
      user_id: ctx.member.user_id,
      invoice_id: invoiceId,
      amount: Number(remaining.toFixed(2)),
      currency: invoice.currency ?? "USD",
      payment_date: new Date().toISOString().slice(0, 10),
      organization_id: ctx.org.id,
    });
  }

  await supabase
    .from("invoices")
    .update({ status: "paid" as InvoiceStatus })
    .eq("id", invoiceId);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase.from("invoices").update({ status }).eq("id", invoiceId);
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/dashboard");
}

export async function deleteInvoice(invoiceId: string) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", invoiceId);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

async function nextInvoiceNumber(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orgId: string,
): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId);
  let seq = (count ?? 0) + 1;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `INV-${year}-${String(seq).padStart(3, "0")}`;
    const { data } = await supabase
      .from("invoices")
      .select("id")
      .eq("organization_id", orgId)
      .eq("invoice_number", candidate)
      .maybeSingle();
    if (!data) return candidate;
    seq += 1;
  }
  return `INV-${year}-${Date.now().toString().slice(-6)}`;
}

export interface CreateInvoiceItemInput {
  description: string;
  quantity: number;
  rate: number;
  product_id?: string | null;
}

export interface CreateInvoiceInput {
  client_id: string | null;
  client_name: string;
  client_email: string;
  client_address: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  currency: string;
  status: "draft" | "pending";
  tax_rate: number;
  discount_amount: number;
  notes: string;
  terms: string;
  items: CreateInvoiceItemInput[];
}

export async function createInvoiceAction(
  input: CreateInvoiceInput,
): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const supabase = await createClient();
    const orgId = ctx.org.id;

    if (!input.due_date) return { ok: false, error: "Due date is required." };
    const items = (input.items ?? []).filter(
      (it) => it.description.trim() !== "" && Number(it.quantity) > 0,
    );
    if (items.length === 0)
      return { ok: false, error: "Add at least one line item." };

    // Snapshot business details from the active organization
    const { data: org } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    const subtotal = items.reduce(
      (s, it) => s + Number(it.quantity) * Number(it.rate),
      0,
    );
    const discount = Math.min(Math.max(0, Number(input.discount_amount) || 0), subtotal);
    const taxAmount = ((subtotal - discount) * (Number(input.tax_rate) || 0)) / 100;
    const total = subtotal - discount + taxAmount;

    const invoiceNumber =
      input.invoice_number.trim() ||
      (await nextInvoiceNumber(supabase, orgId));

    const status: InvoiceStatus = input.status === "pending" ? "pending" : "draft";

    const { data: invoice, error: invError } = await supabase
      .from("invoices")
      .insert({
        user_id: ctx.member.user_id,
        organization_id: orgId,
        client_id: input.client_id || null,
        invoice_number: invoiceNumber,
        status,
        issue_date: input.issue_date || new Date().toISOString().slice(0, 10),
        due_date: input.due_date,
        currency: input.currency || "USD",
        subtotal: Number(subtotal.toFixed(2)),
        tax_rate: Number(input.tax_rate) || 0,
        tax_amount: Number(taxAmount.toFixed(2)),
        discount_amount: Number(discount.toFixed(2)),
        total: Number(total.toFixed(2)),
        notes: input.notes ?? "",
        terms: input.terms ?? "",
        business_name: org?.name ?? "",
        business_email: org?.company_email ?? "",
        business_address: org?.company_address ?? "",
        business_phone: org?.company_phone ?? "",
        client_name: input.client_name ?? "",
        client_email: input.client_email ?? "",
        client_address: input.client_address ?? "",
      })
      .select("id")
      .single();

    if (invError || !invoice)
      return {
        ok: false,
        error: invError?.message.includes("unique")
          ? `Invoice number "${invoiceNumber}" already exists.`
          : "Failed to save invoice.",
      };

    const { error: itemsError } = await supabase.from("invoice_items").insert(
      items.map((it) => ({
        invoice_id: invoice.id,
        description: it.description.trim(),
        quantity: Number(it.quantity),
        rate: Number(it.rate),
        amount: Number((Number(it.quantity) * Number(it.rate)).toFixed(2)),
      })),
    );
    if (itemsError) return { ok: false, error: "Failed to save line items." };

    // Deduct stock for tracked products linked to line items
    const productIds = [
      ...new Set(items.map((it) => it.product_id).filter(Boolean)),
    ] as string[];
    if (productIds.length > 0 && status !== "draft") {
      const { data: products } = await supabase
        .from("products")
        .select("id,stock_quantity,track_stock")
        .in("id", productIds)
        .eq("organization_id", orgId);
      for (const p of products ?? []) {
        if (!p.track_stock) continue;
        const sold = items
          .filter((it) => it.product_id === p.id)
          .reduce((s, it) => s + Number(it.quantity), 0);
        if (sold <= 0) continue;
        await supabase
          .from("products")
          .update({
            stock_quantity: Math.max(0, Math.trunc(Number(p.stock_quantity) - sold)),
          })
          .eq("id", p.id);
      }
    }

    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    revalidatePath("/reports");
    revalidatePath("/products");
    return { ok: true, id: invoice.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
}

export async function recordPayment(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("editor");
    const supabase = await createClient();
    const invoiceId = str(formData, "invoice_id");
    const amount = num(formData, "amount");

    if (!invoiceId) return { ok: false, error: "Missing invoice." };
    if (amount <= 0) return { ok: false, error: "Amount must be greater than zero." };

    const { data: invoice } = await supabase
      .from("invoices")
      .select("id,total,currency,status")
      .eq("id", invoiceId)
      .single();
    if (!invoice) return { ok: false, error: "Invoice not found." };

    await supabase.from("payments").insert({
      user_id: ctx.member.user_id,
      organization_id: ctx.org.id,
      invoice_id: invoiceId,
      amount: Number(amount.toFixed(2)),
      currency: invoice.currency ?? "USD",
      payment_method: (str(formData, "payment_method", "cash") || "cash") as PaymentMethod,
      payment_date: str(formData, "payment_date", new Date().toISOString().slice(0, 10)),
      reference: str(formData, "reference"),
      notes: str(formData, "notes"),
    });

    // Auto-mark paid when balance is covered
    if (invoice.status !== "paid") {
      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", invoiceId);
      const paid = (payments ?? []).reduce((s, p) => s + Number(p.amount), 0);
      if (paid >= Number(invoice.total) - 0.005) {
        await supabase
          .from("invoices")
          .update({ status: "paid" as InvoiceStatus })
          .eq("id", invoiceId);
      }
    }

    revalidatePath(`/invoices/${invoiceId}`);
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    revalidatePath("/reports");
    return { ok: true, id: invoiceId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to record payment.",
    };
  }
}

// ===================== CLIENTS =====================

export async function createClientAction(formData: FormData) {
  const ctx = await requireRole("editor");
  const supabase = await createClient();

  const name = str(formData, "name");
  const email = str(formData, "email");
  if (!name || !email) return;

  await supabase.from("clients").insert({
    user_id: ctx.member.user_id,
    organization_id: ctx.org.id,
    name,
    email,
    phone: str(formData, "phone"),
    address: str(formData, "address"),
    company: str(formData, "company"),
  });

  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function deleteClient(clientId: string) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", clientId);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function updateClient(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole("editor");
    const supabase = await createClient();
    const clientId = str(formData, "client_id");
    const name = str(formData, "name");
    const email = str(formData, "email");
    if (!clientId || !name || !email)
      return { ok: false, error: "Name and email are required." };

    const { error } = await supabase
      .from("clients")
      .update({
        name,
        email,
        phone: str(formData, "phone"),
        address: str(formData, "address"),
        company: str(formData, "company"),
        status: str(formData, "status", "active") === "inactive" ? "inactive" : "active",
      })
      .eq("id", clientId);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/clients");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update client." };
  }
}

// ===================== PRODUCTS / INVENTORY =====================

export async function createProductAction(formData: FormData) {
  const ctx = await requireRole("editor");
  const supabase = await createClient();

  const name = str(formData, "name");
  if (!name) return;

  await supabase.from("products").insert({
    user_id: ctx.member.user_id,
    organization_id: ctx.org.id,
    name,
    description: str(formData, "description"),
    unit_price: num(formData, "unit_price"),
    currency: str(formData, "currency", "USD"),
    category: str(formData, "category"),
    unit: str(formData, "unit", "item"),
    sku: str(formData, "sku"),
    stock_quantity: Math.trunc(num(formData, "stock_quantity")),
    low_stock_threshold: Math.trunc(num(formData, "low_stock_threshold", 5)),
    track_stock: formData.get("track_stock") === "on",
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function updateProductStock(productId: string, quantity: number) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ stock_quantity: Math.max(0, Math.trunc(quantity)) })
    .eq("id", productId);
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);
  revalidatePath("/products");
}

export async function deleteProduct(productId: string) {
  await requireRole("editor");
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

// ===================== SETTINGS / PROFILE =====================

export async function updateProfile(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: str(formData, "full_name"),
      company_name: str(formData, "company_name"),
      company_email: str(formData, "company_email"),
      company_address: str(formData, "company_address"),
      company_phone: str(formData, "company_phone"),
      default_currency: str(formData, "default_currency", "USD"),
      default_tax_rate: num(formData, "default_tax_rate"),
      default_notes: str(formData, "default_notes"),
      default_terms: str(formData, "default_terms"),
    });

  revalidatePath("/settings");
}

// ===================== TEAM =====================

export async function inviteTeamMember(formData: FormData): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    const supabase = await createClient();

    const email = str(formData, "email").toLowerCase();
    const name = str(formData, "name", email.split("@")[0] ?? "Member");
    if (!email.includes("@")) return { ok: false, error: "Enter a valid email." };

    const role = str(formData, "role", "viewer");

    // Skip duplicates
    const { data: dup } = await supabase
      .from("team_members")
      .select("id")
      .eq("organization_id", ctx.org.id)
      .eq("email", email)
      .maybeSingle();
    if (dup) return { ok: false, error: "This person is already on your team." };

    const { error } = await supabase.from("team_members").insert({
      organization_id: ctx.org.id,
      invited_by: ctx.member.user_id,
      email,
      name,
      role: ["owner", "admin", "editor", "viewer"].includes(role) ? role : "viewer",
      department: str(formData, "department"),
      status: "pending",
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/team");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to send invite." };
  }
}

export async function updateTeamMemberRole(
  memberId: string,
  role: TeamRole,
): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    const supabase = await createClient();

    // Only owners may create/modify other owners
    if (role === "owner" && ctx.member.role !== "owner")
      return { ok: false, error: "Only an owner can assign the owner role." };

    // Admins cannot touch owners
    const { data: member } = await supabase
      .from("team_members")
      .select("role")
      .eq("id", memberId)
      .single();
    if (member?.role === "owner" && ctx.member.role !== "owner")
      return { ok: false, error: "Admins cannot modify the owner." };

    const { error } = await supabase
      .from("team_members")
      .update({ role })
      .eq("id", memberId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/team");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update member." };
  }
}

export async function removeTeamMember(memberId: string): Promise<ActionResult> {
  try {
    const ctx = await requireRole("admin");
    const supabase = await createClient();

    const { data: member } = await supabase
      .from("team_members")
      .select("role,user_id")
      .eq("id", memberId)
      .single();
    if (!member) return { ok: false, error: "Member not found." };
    if (member.role === "owner")
      return { ok: false, error: "The owner cannot be removed." };
    if (ctx.member.role !== "owner" && member.role === "admin")
      return { ok: false, error: "Admins can only remove editors and viewers." };
    if (member.user_id === ctx.member.user_id)
      return { ok: false, error: "You cannot remove yourself." };

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/team");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to remove member." };
  }
}

// ===================== SEARCH =====================

export async function searchWorkspaceData() {
  const ctx = await requireRole("viewer");
  const supabase = await createClient();

  const [
    { data: clientsData },
    { data: productsData },
    { data: invoicesData },
    { data: teamData },
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("id, name, email, status")
      .eq("organization_id", ctx.org.id)
      .order("name"),
    supabase
      .from("products")
      .select("id, name, description, unit_price, category")
      .eq("organization_id", ctx.org.id)
      .order("name"),
    supabase
      .from("invoices")
      .select("id, invoice_number, status, total, client_name")
      .eq("organization_id", ctx.org.id)
      .order("issue_date", { ascending: false }),
    supabase
      .from("team_members")
      .select("id, name, email, role, department, status")
      .eq("organization_id", ctx.org.id)
      .order("name"),
  ]);

  return { clientsData, productsData, invoicesData, teamData };
}

