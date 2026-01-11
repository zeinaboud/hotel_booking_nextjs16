import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function createCheckoutSession(bookingRequestId: string)
{
  // 1. validation
  if (!bookingRequestId)
  {
    throw new Error("Booking request id is required");
  }

  // 2. get booking request
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
  });

  if (!booking)
  {
    throw new Error("Booking request not found");
  }

  if (booking.status !== "PENDING")
  {
    throw new Error("Booking already processed");
  }

  // 3. create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    currency: "aed",
    line_items: [
      {
        price_data: {
          currency: "aed",
          product_data: {
            name: "Hotel Room Booking",
          },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      bookingRequestId: booking.id,
      roomId: booking.roomId,
    },

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
  });

  // 4. save stripe session id
  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: {
      stripeSessionId: session.id,
    },
  });

  // 5. return checkout url
  return session.url;
}
