import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover" as Stripe.LatestApiVersion,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Signature verification failed:", err.message);
    console.error("Signature verification failed:", err?.message ?? err);
  }

  if (event.type !== "checkout.session.completed") {
  // Helpful logs for debugging delivered events
  try {
    console.log(`Stripe event received: id=${event.id} type=${event.type}`);
  } catch (e) {
    console.log("Stripe event received (unable to stringify id/type)", e);
  }
    return NextResponse.json({ received: true });
  }

  try {
    console.log("loveeeee")
  } catch (err: any) {
    console.error("Webhook processing error:", err.message);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
