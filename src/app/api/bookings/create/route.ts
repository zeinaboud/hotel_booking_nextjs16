import { auth } from "@/auth";
import { BookingError, createBookingRequest } from "@/lib/services/createBookingRequest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();
    console.log("SESSION ===>", session);
    if (!session?.user?.id)
    {
      return Response.json(
        { error: "Unouthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const result = await createBookingRequest({
      userId: userId,
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


    if (err instanceof BookingError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: err.status }
      );
    }


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
