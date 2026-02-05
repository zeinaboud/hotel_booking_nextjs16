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
    console.error("Signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingRequestId = session.metadata?.bookingRequestId;
    if (!bookingRequestId) throw new Error("Missing bookingRequestId");

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
    });
    if (!bookingRequest) throw new Error("BookingRequest not found");

    if (bookingRequest.status === "CONFIRMED") {
      return NextResponse.json({ received: true });
    }

    const room = await prisma.room.findUnique({
      where: { id: bookingRequest.roomId },
    });
    if (!room) throw new Error("Room not found");

    await prisma.bookingRequest.update({
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

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err.message);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
