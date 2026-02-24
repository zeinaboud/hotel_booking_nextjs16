import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover' as Stripe.LatestApiVersion,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event | null = null;
  const canBypassSignature =
    process.env.NODE_ENV !== 'production' && !process.env.STRIPE_WEBHOOK_SECRET;

  if (canBypassSignature) {
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid event body' }, { status: 400 });
    }
  } else {
    if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error('Signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingRequestId = session.metadata?.bookingRequestId;

    if (!bookingRequestId) {
      console.warn('Missing bookingRequestId, skipping processing.');
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      // update booking request to confirmed
      const updatedBooking = await tx.bookingRequest.updateMany({
        where: {
          id: bookingRequestId,
          status: 'PENDING',
          expireAt: { gt: new Date() },
        },
        data: {
          status: 'CONFIRMED',
          stripeSessionId: session.id,
        },
      });
      if (updatedBooking.count === 0) {
        console.warn(`BookingRequest ${bookingRequestId} expired or already processed`);
        return NextResponse.json({ received: true });
      }
    });
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err.message ?? err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
