import { requireOrg } from "@/lib/erp/org";
import { createClient } from "@/lib/supabase/server";
import { BillingPortalButton } from "@/components/erp/billing-portal-button";
import { UpgradeButton } from "@/components/erp/upgrade-button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function BillingSettingsPage() {
  const { org } = await requireOrg();
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("organization_id", org.id)
    .single();

  const isPro = subscription && subscription.status === "active";

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Billing & Subscription</h2>
        <p className="text-muted-foreground">Manage your subscription, billing details, and view invoices.</p>
      </div>

      <div className="border rounded-lg p-6 max-w-2xl bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Current Plan</h3>
            <Badge variant={isPro ? "default" : "secondary"} className="text-sm">
              {isPro ? "Pro Plan" : "Free Plan"}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            {isPro ? (
              <>
                <p>Your subscription is currently active.</p>
                {subscription.cancel_at_period_end ? (
                  <p className="text-destructive mt-1">
                    Your subscription will be canceled on {format(new Date(subscription.current_period_end), "PP")}.
                  </p>
                ) : (
                  <p className="mt-1">
                    Your next billing date is {format(new Date(subscription.current_period_end), "PP")}.
                  </p>
                )}
              </>
            ) : (
              <p>You are currently on the Free plan. Upgrade to unlock all features.</p>
            )}
          </div>

          <div className="pt-4 border-t mt-2 flex gap-4">
            {isPro ? (
              <BillingPortalButton />
            ) : (
              <UpgradeButton priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_123"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
