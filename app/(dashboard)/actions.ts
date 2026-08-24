"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { InvoiceStatus, PaymentMethod } from "@/lib/erp/types";

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

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

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

// ===================== EXPENSES =====================

export async function createExpense(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  const title = str(formData, "title");
  if (!title) return;

  await supabase.from("expenses").insert({
    user_id: userId,
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
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("expenses").delete().eq("id", id);
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

// ===================== INVOICES =====================

export async function markInvoicePaid(invoiceId: string) {
  const userId = await requireUserId();
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
      user_id: userId,
      invoice_id: invoiceId,
      amount: Number(remaining.toFixed(2)),
      currency: invoice.currency ?? "USD",
      payment_date: new Date().toISOString().slice(0, 10),
    });
  }

  await supabase
    .from("invoices")
    .update({ status: "paid" as InvoiceStatus })
    .eq("id", invoiceId);

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("invoices").update({ status }).eq("id", invoiceId);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
}

export async function deleteInvoice(invoiceId: string) {
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", invoiceId);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
}

async function nextInvoiceNumber(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  let seq = (count ?? 0) + 1;
  // Retry a few times in case of number collisions
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `INV-${year}-${String(seq).padStart(3, "0")}`;
    const { data } = await supabase
      .from("invoices")
      .select("id")
      .eq("user_id", userId)
      .eq("invoice_number", candidate)
      .maybeSingle();
    if (!data) return candidate;
    seq += 1;
  }
  return `INV-${year}-${Date.now().toString().slice(-6)}`;
}

export async function createInvoiceAction(
  input: CreateInvoiceInput,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const supabase = await createClient();

    if (!input.due_date) return { ok: false, error: "Due date is required." };
    const items = (input.items ?? []).filter(
      (it) => it.description.trim() !== "" && Number(it.quantity) > 0,
    );
    if (items.length === 0)
      return { ok: false, error: "Add at least one line item." };

    // Snapshot business details from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
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
      (await nextInvoiceNumber(supabase, userId));

    const status: InvoiceStatus = input.status === "pending" ? "pending" : "draft";

    const { data: invoice, error: invError } = await supabase
      .from("invoices")
      .insert({
        user_id: userId,
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
        business_name: profile?.company_name ?? "",
        business_email: profile?.company_email ?? "",
        business_address: profile?.company_address ?? "",
        business_phone: profile?.company_phone ?? "",
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
        .eq("user_id", userId);
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
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function recordPayment(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
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
      user_id: userId,
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
  } catch {
    return { ok: false, error: "Failed to record payment." };
  }
}

// ===================== CLIENTS =====================

export async function createClientAction(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  const name = str(formData, "name");
  const email = str(formData, "email");
  if (!name || !email) return;

  await supabase.from("clients").insert({
    user_id: userId,
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
  await requireUserId();
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", clientId);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function updateClient(formData: FormData): Promise<ActionResult> {
  try {
    await requireUserId();
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
  } catch {
    return { ok: false, error: "Failed to update client." };
  }
}

// ===================== PRODUCTS / INVENTORY =====================

export async function createProductAction(formData: FormData) {
  const userId = await requireUserId();
  const supabase = await createClient();

  const name = str(formData, "name");
  if (!name) return;

  await supabase.from("products").insert({
    user_id: userId,
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
  await requireUserId();
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ stock_quantity: Math.max(0, Math.trunc(quantity)) })
    .eq("id", productId);
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  await requireUserId();
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);
  revalidatePath("/products");
}

export async function deleteProduct(productId: string) {
  await requireUserId();
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

type TeamRole = "admin" | "editor" | "viewer";

async function ensureOrganization(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", userId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name,full_name")
    .eq("id", userId)
    .single();

  const { data: org, error } = await supabase
    .from("organizations")
    .insert({
      owner_id: userId,
      name: profile?.company_name || `${profile?.full_name || "My"}'s Business`,
    })
    .select("id")
    .single();
  if (error) return null;
  return org.id;
}

export async function inviteTeamMember(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const supabase = await createClient();

    const email = str(formData, "email").toLowerCase();
    const name = str(formData, "name", email.split("@")[0] ?? "Member");
    if (!email.includes("@")) return { ok: false, error: "Enter a valid email." };

    const orgId = await ensureOrganization(supabase, userId);
    if (!orgId) return { ok: false, error: "Could not create organization." };

    const role = str(formData, "role", "viewer") as TeamRole;

    // Skip duplicates
    const { data: dup } = await supabase
      .from("team_members")
      .select("id")
      .eq("organization_id", orgId)
      .eq("email", email)
      .maybeSingle();
    if (dup) return { ok: false, error: "This person is already on your team." };

    const { error } = await supabase.from("team_members").insert({
      organization_id: orgId,
      email,
      name,
      role: ["admin", "editor", "viewer"].includes(role) ? role : "viewer",
      department: str(formData, "department"),
      status: "inactive", // pending until they accept the invite
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/team");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to send invite." };
  }
}

export async function updateTeamMemberRole(
  memberId: string,
  role: TeamRole,
): Promise<ActionResult> {
  try {
    await requireUserId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("team_members")
      .update({ role })
      .eq("id", memberId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/team");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update member." };
  }
}

export async function removeTeamMember(memberId: string): Promise<ActionResult> {
  try {
    await requireUserId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/team");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to remove member." };
  }
}