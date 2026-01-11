import { prisma } from "@/lib/prisma";

export class BookingError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

interface CreateBookingRequestInput {
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
}

export async function createBookingRequest({
  roomId,
  hotelId,
  checkIn,
  checkOut,
}: CreateBookingRequestInput) {

  //  Validation
  if (!roomId || !hotelId || !checkIn || !checkOut) {
    throw new BookingError("Missing booking data");
  }

  const ci = new Date(checkIn);
  const co = new Date(checkOut);

  if (isNaN(ci.getTime()) || isNaN(co.getTime())) {
    throw new BookingError("Invalid date format");
  }

  if (ci >= co) {
    throw new BookingError("Check-out must be after check-in");
  }

  // Fetch room + check availability
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      branchHotelId: hotelId,
      available: true,
    },
    include: {
      bookings: {
        where: {
          AND: [
            { checkIn: { lt: co } },
            { checkOut: { gt: ci } },
          ],
        },
      },
    },
  });

  if (!room) {
    throw new BookingError("Room not found or not available");
  }

  if (room.bookings.length > 0) {
    throw new BookingError("Room is already booked for selected dates");
  }

  // Calculate nights
  const nights =
    (co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24);

  if (nights <= 0) {
    throw new BookingError("Invalid booking duration");
  }

  // Calculate total price
  const totalPrice = Math.round(room.price * nights);

  if (totalPrice <= 0) {
    throw new BookingError("Invalid total price");
  }

  // Create booking request (NOT final booking)
  const bookingRequest = await prisma.bookingRequest.create({
    data: {
      roomId,
      branchId: hotelId,
      checkIn: ci,
      checkOut: co,
      totalPrice,
      status: "PENDING",
      roomName: room.name,
      roomType: room.type,
      roomPrice: room.price,
    },
  });

  return {
    bookingRequestId: bookingRequest.id,
    nights,
    totalPrice,
  };
}
