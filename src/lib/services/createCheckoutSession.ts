import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// إعداد Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

export default async function createCheckoutSession(bookingRequestId: string) {
  if (!bookingRequestId) throw new Error('Booking request id is required');

  // جلب بيانات الحجز مع الغرف والهوتيل
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
    include: {
      branch: {
        include: {
          hotel: true,
        },
      },
      items: {
        include: {
          room: true,
        },
      },
    },
  });

  if (!booking) throw new Error('Booking request not found');
  if (booking.status !== 'PENDING') throw new Error('Booking already processed');

  // حساب عدد الليالي
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) throw new Error('Invalid booking dates');

  // حساب السعر الكلي لكل الغرف × الكمية × الليالي
  let totalAmount = 0;
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of booking.items) {
    const roomPrice = item.room.price;
    const quantity = item.quantity;
    const roomTotal = roomPrice * quantity * nights; // السعر لكل هذا الـ BookingItem
    totalAmount += roomTotal;

    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Hotel Booking - ${booking.branch.hotel.name} | Room: ${item.room.name}`,
          description: `Stay from ${booking.checkIn} to ${booking.checkOut} | Type: ${item.room.type}`,
        },
        unit_amount: Math.round(roomTotal * 100), // تحويل الدولار إلى سنتات
      },
      quantity: 1, // نرسل كل BookingItem كـ line_item منفصل
    });
  }

  // إنشاء جلسة Stripe
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    metadata: {
      bookingRequestId: booking.id,
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
