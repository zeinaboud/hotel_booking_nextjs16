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

  // In local dev you can skip signature verification by NOT setting STRIPE_WEBHOOK_SECRET
  // This helps when stripe CLI cannot be installed. DO NOT use in production.
  const canBypassSignature =
    process.env.NODE_ENV !== 'production' && !process.env.STRIPE_WEBHOOK_SECRET;

  if (canBypassSignature) {
    try {
      event = JSON.parse(body) as Stripe.Event;
      console.log('Bypassed signature verification (dev). Event parsed.');
    } catch (e) {
      console.error('Failed to parse event body in bypass mode:', e);
      return NextResponse.json({ error: 'Invalid event body' }, { status: 400 });
    }
  } else {
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error('Signature verification failed:', err?.message ?? err);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }
  }

  try {
    console.log(`Stripe event received: id=${event.id} type=${event.type}`);
  } catch (e) {
    console.log('Stripe event received (unable to stringify id/type)', e);
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingRequestId = session.metadata?.bookingRequestId;
    console.log('bookingRequestId from metadata:', bookingRequestId);
    if (!bookingRequestId) throw new Error('Missing bookingRequestId');

    const bookingRequesTable = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
    });
    console.log('bookingRequest row:', bookingRequesTable);
    if (!bookingRequesTable) throw new Error('BookingRequest not found');

    if (bookingRequesTable.status === 'CONFIRMED') {
      return NextResponse.json({ received: true });
    }

    const room = await prisma.room.findUnique({
      where: { id: bookingRequesTable.roomId },
    });
    if (!room) throw new Error('Room not found');

    await prisma.bookingRequest.update({
      where: { id: bookingRequestId },
      data: {
        status: 'CONFIRMED',
        stripeSessionId: session.id,
      },
    });

    // Mark room as not available (best-effort)
    try {
      await prisma.room.update({
        where: { id: bookingRequesTable.roomId },
        data: { available: false },
      });
    } catch (e) {
      console.error('Failed to update room availability:', e);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err?.message ?? err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
