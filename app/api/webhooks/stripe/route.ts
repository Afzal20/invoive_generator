import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const organizationId = session.client_reference_id || session.metadata?.organization_id;

      if (organizationId) {
        await supabase
          .from("organizations")
          .update({
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
          })
          .eq("id", organizationId);

        const periodStart = (subscription as unknown as Record<string, number>).current_period_start
          ? new Date((subscription as unknown as Record<string, number>).current_period_start * 1000).toISOString()
          : new Date().toISOString();
        const periodEnd = (subscription as unknown as Record<string, number>).current_period_end
          ? new Date((subscription as unknown as Record<string, number>).current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await supabase.from("subscriptions").upsert({
          organization_id: organizationId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          price_id: subscription.items?.data?.[0]?.price?.id || null,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          created_at: new Date(subscription.created * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = (invoice as unknown as Record<string, string>).subscription;
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (org) {
        const periodStart = (subscription as unknown as Record<string, number>).current_period_start
          ? new Date((subscription as unknown as Record<string, number>).current_period_start * 1000).toISOString()
          : new Date().toISOString();
        const periodEnd = (subscription as unknown as Record<string, number>).current_period_end
          ? new Date((subscription as unknown as Record<string, number>).current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        await supabase.from("subscriptions").update({
          status: subscription.status,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        }).eq("stripe_subscription_id", subscription.id);
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const periodStart = (subscription as unknown as Record<string, number>).current_period_start
      ? new Date((subscription as unknown as Record<string, number>).current_period_start * 1000).toISOString()
      : new Date().toISOString();
    const periodEnd = (subscription as unknown as Record<string, number>).current_period_end
      ? new Date((subscription as unknown as Record<string, number>).current_period_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from("subscriptions").update({
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    }).eq("stripe_subscription_id", subscription.id);
  }

  return new NextResponse("Webhook processed", { status: 200 });
}
