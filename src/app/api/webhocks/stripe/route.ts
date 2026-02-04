import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
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
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }


  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingRequestId = session.metadata?.bookingRequestId;

    if (!bookingRequestId) {
      return NextResponse.json({ error: "Missing bookingRequestId" }, { status: 400 });
    }
    const bookingRequest =  await prisma.bookingRequest.update({
      where: { id: bookingRequestId },
      data: {
        status: "CONFIRMED",
        stripeSessionId: session.id,
      },
    });

    await prisma.booking.create({
      data: {
        userId: bookingRequest.userId,
        roomId: bookingRequest.roomId,
        checkIn: new Date(bookingRequest.checkIn),
        checkOut: new Date(bookingRequest.checkOut),
        status: "CONFIRMED",
      },
    });
  }
  console.log("Stripe event type:", event.type);


  return NextResponse.json({ received: true });
}
