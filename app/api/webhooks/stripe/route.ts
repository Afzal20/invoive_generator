import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// We need a service role client to bypass RLS since the webhook is not authenticated as a user
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    
    // organization_id passed via clientReferenceId or metadata
    const organizationId = session.client_reference_id;
    
    if (organizationId) {
      await supabase
        .from("organizations")
        .update({
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
        })
        .eq("id", organizationId);
        
      await supabase.from("subscriptions").upsert({
        organization_id: organizationId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        current_period_start: new Date((subscription as unknown as Record<string, number>).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as unknown as Record<string, number>).current_period_end * 1000).toISOString(),
        created_at: new Date(subscription.created * 1000).toISOString(),
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscription = await stripe.subscriptions.retrieve(
      (invoice as unknown as Record<string, string>).subscription
    );

    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("stripe_subscription_id", subscription.id)
      .single();

    if (org) {
      await supabase.from("subscriptions").update({
        status: subscription.status,
        current_period_start: new Date((subscription as unknown as Record<string, number>).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as unknown as Record<string, number>).current_period_end * 1000).toISOString(),
      }).eq("stripe_subscription_id", subscription.id);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase.from("subscriptions").update({
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      current_period_start: new Date((subscription as unknown as Record<string, number>).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as unknown as Record<string, number>).current_period_end * 1000).toISOString(),
    }).eq("stripe_subscription_id", subscription.id);
  }

  return new NextResponse("Webhook processed", { status: 200 });
}
