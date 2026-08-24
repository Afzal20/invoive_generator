import { createClient } from "@/lib/supabase/server";
import { requireOrg } from "@/lib/erp/org";
import {
  CreateInvoiceForm,
} from "@/components/erp/create-invoice-form";
import type { Client, Product, Profile } from "@/lib/erp/types";

export default async function CreateInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const supabase = await createClient();
  const { org, member } = await requireOrg();
  const params = await searchParams;

  const [{ data: clients }, { data: products }, { data: profile }, { count }] =
    await Promise.all([
      supabase.from("clients").select("*").eq("organization_id", org.id).order("name"),
      supabase.from("products").select("*").eq("organization_id", org.id).order("name"),
      supabase.from("profiles").select("*").eq("id", member.user_id ?? "").maybeSingle(),
      supabase
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", org.id),
    ]);

  const year = new Date().getFullYear();
  const suggestedNumber = `INV-${year}-${String((count ?? 0) + 1).padStart(3, "0")}`;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Create Invoice</h2>
            <p className="text-sm text-muted-foreground">
              Bill a client, pull items from your catalog, and track payment.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <CreateInvoiceForm
              clients={(clients as Client[]) ?? []}
              products={(products as Product[]) ?? []}
              profile={(profile as Profile) ?? null}
              suggestedNumber={suggestedNumber}
              defaultClientId={params.client}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
