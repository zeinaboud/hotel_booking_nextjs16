import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// نستخدم apiVersion ثابتة وآمنة
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

export default async function createCheckoutSession(bookingRequestId: string) {
  await stripe.accounts.retrieve();
  if (!bookingRequestId) throw new Error('Booking request id is required');

  // جلب البيانات من DB
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
  });

  if (!booking) throw new Error('Booking request not found');
  if (booking.status !== 'PENDING') throw new Error('Booking already processed');
  const amount = Number(booking.totalPrice);

  if (isNaN(amount)) {
    throw new Error('Invalid totalPrice');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    // تجنب automatic_payment_methods لتقليل مشاكل sandbox
    payment_method_types: ['card'],

    line_items: [
      {
        price_data: {
          currency: 'usd', // أو "aed" حسب حاجتك
          product_data: {
            name: booking.roomName,
          },
          unit_amount: Math.round(amount), // لازم سنتات صحيحة
        },
        quantity: 1,
      },
    ],

    metadata: {
      bookingRequestId: booking.id,
      roomId: booking.roomId,
    },

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkoutProccess/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkoutProccess/cancel`,
  });

  // حفظ stripe session id في DB
  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: { stripeSessionId: session.id },
  });

  return session.url;
}
