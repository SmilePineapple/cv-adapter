import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Webhook requests carry no user session — every write here uses the
// admin (service-role) client, same as the skill_assessment_* tables
// earlier this session. Signature verification against the raw body is
// what proves a request actually came from Stripe, not RLS.
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = createAdminClient();

  async function upsertSubscription(
    userId: string,
    fields: {
      stripe_customer_id: string;
      stripe_subscription_id?: string;
      status: string;
      current_period_start?: string;
      current_period_end?: string;
    }
  ) {
    await admin
      .from("subscriptions")
      .upsert(
        { user_id: userId, updated_at: new Date().toISOString(), ...fields },
        { onConflict: "user_id" }
      );

    await admin
      .from("usage_tracking")
      .update({
        subscription_tier: fields.status === "active" || fields.status === "trialing" ? "pro_monthly" : "free",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (!userId || !session.customer) break;

        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

        let status = "active";
        let periodStart: string | undefined;
        let periodEnd: string | undefined;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          status = sub.status;
          const item = sub.items.data[0];
          if (item) {
            periodStart = new Date(item.current_period_start * 1000).toISOString();
            periodEnd = new Date(item.current_period_end * 1000).toISOString();
          }
        }

        await upsertSubscription(userId, {
          stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer.id,
          stripe_subscription_id: subscriptionId,
          status,
          current_period_start: periodStart,
          current_period_end: periodEnd,
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        const item = sub.items.data[0];
        await upsertSubscription(userId, {
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_start: item
            ? new Date(item.current_period_start * 1000).toISOString()
            : undefined,
          current_period_end: item
            ? new Date(item.current_period_end * 1000).toISOString()
            : undefined,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        await upsertSubscription(userId, {
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          stripe_subscription_id: sub.id,
          status: "canceled",
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
