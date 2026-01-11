// src/app/api/bookings/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
)
{

  const bookingRequestId = params.id;

  if (!bookingRequestId)
  {
    return NextResponse.json(
      { error: "Missing bookingRequestId" },
      { status: 400 }
    );
  }

  const bookingRequest = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
  });

  if (!bookingRequest)
  {
    return NextResponse.json(
      { error: "Booking request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: { bookingRequest },
  });
}
