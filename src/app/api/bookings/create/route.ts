import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { BookingError, createBookingRequest } from '@/lib/services/createBookingRequest';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();

    // إذا ما فيه session أو user
    if (!session?.user?.email) {
      // ممكن ترجع 401 وتعطي رسالة واضحة
      return NextResponse.json({ error: 'Please sign in first' }, { status: 401 });
    }

    // جلب userId الحقيقي من قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found, please sign in' }, { status: 401 });
    }

    // إنشاء الحجز
    const result = await createBookingRequest({
      userId: user.id,
      roomType: body.roomType,
      hotelId: body.hotelId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      quantity: body.quantity,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          bookingRequestIds: [result.bookingRequest.id],
          totalPrice: result.totalPrice,
          nights: result.nights,
        },
      },
      { status: 201 },
    );
  } catch (err: any) {
    if (err instanceof BookingError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
