import { prisma } from '@/lib/prisma';
import { BookingItem, BookingRequestStatus, Room } from '@prisma/client';

export class BookingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

interface CreateBookingRequestInput {
  userId: string;
  roomType: 'SINGLE' | 'DOUBLE' | 'SUITE';
  hotelId: string; // BranchHotel ID
  checkIn: string;
  checkOut: string;
  quantity: number;
}

type RoomWithBookings = Room & { bookings: BookingItem[] };

export async function createBookingRequest({
  userId,
  roomType,
  hotelId,
  checkIn,
  checkOut,
  quantity,
}: CreateBookingRequestInput) {
  if (!roomType || !hotelId || !checkIn || !checkOut || !quantity || quantity <= 0) {
    throw new BookingError('Missing or invalid booking data');
  }

  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  if (isNaN(ci.getTime()) || isNaN(co.getTime()) || ci >= co) {
    throw new BookingError('Invalid check-in or check-out dates');
  }

  const nights = (co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24);
  if (nights <= 0) throw new BookingError('Invalid booking period');

  return await prisma.$transaction(async (tx) => {
    // تنظيف الحجوزات المعلقة المنتهية
    await tx.bookingRequest.updateMany({
      where: {
        status: BookingRequestStatus.PENDING,
        expireAt: { lt: new Date() },
      },
      data: { status: BookingRequestStatus.CANCELLED },
    });

    // جلب كل الغرف من النوع المطلوب مع الحجوزات المتداخلة
    const rooms: RoomWithBookings[] = await tx.room.findMany({
      where: { branchHotelId: hotelId, type: roomType },
      include: {
        bookings: {
          where: {
            bookingRequest: {
              OR: [
                {
                  status: BookingRequestStatus.CONFIRMED,
                  checkIn: { lt: co },
                  checkOut: { gt: ci },
                },
                {
                  status: BookingRequestStatus.PENDING,
                  expireAt: { gt: new Date() },
                  checkIn: { lt: co },
                  checkOut: { gt: ci },
                },
              ],
            },
          },
        },
      },
    });

    if (rooms.length === 0) throw new BookingError('No rooms of this type found');

    // توزيع الكمية المطلوبة على الغرف المتاحة
    let remainingQty = quantity;
    const roomsToBook: { roomId: string; qty: number }[] = [];

    for (const room of rooms) {
      const bookedQty = room.bookings.reduce((sum, b) => sum + b.quantity, 0);
      const availableQty = room.totalQuantity - bookedQty;
      if (availableQty > 0) {
        const qtyToBook = Math.min(availableQty, remainingQty);
        roomsToBook.push({ roomId: room.id, qty: qtyToBook });
        remainingQty -= qtyToBook;
        if (remainingQty <= 0) break;
      }
    }

    if (remainingQty > 0) {
      throw new BookingError('Not enough rooms available for the selected type');
    }

    // إنشاء طلب الحجز مرة واحدة فقط
    const bookingRequest = await tx.bookingRequest.create({
      data: {
        userId,
        branchId: hotelId,
        checkIn: ci,
        checkOut: co,
        totalPrice: 0, // سنقوم بحسابه بعد إنشاء الـ BookingItem
        status: BookingRequestStatus.PENDING,
        expireAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // إنشاء BookingItem لكل غرفة وحساب السعر الإجمالي
    let totalPrice = 0;
    for (const b of roomsToBook) {
      const room = rooms.find((r) => r.id === b.roomId)!;
      const price = Math.round(nights * room.price * b.qty);
      totalPrice += price;

      await tx.bookingItem.create({
        data: {
          bookingRequestId: bookingRequest.id,
          roomId: room.id,
          quantity: b.qty,
        },
      });
    }

    // تحديث السعر الإجمالي للـ BookingRequest
    await tx.bookingRequest.update({
      where: { id: bookingRequest.id },
      data: { totalPrice },
    });

    return {
      bookingRequest,
      totalPrice,
      nights,
    };
  });
}
