import { BookingError, createBookingRequest } from "@/lib/services/createBookingRequest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await createBookingRequest({
      roomId: body.roomId,
      hotelId: body.hotelId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );

  } catch (err: any) {

    // أخطاء منطقية متوقعة
    if (err instanceof BookingError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: err.status }
      );
    }

    // أخطاء غير متوقعة (bug / db / infra)
    console.error("Booking API error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
