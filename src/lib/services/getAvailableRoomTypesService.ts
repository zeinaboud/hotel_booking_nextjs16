import { prisma } from '@/lib/prisma';
interface getAvailableRoomTypesInput {
  branchHotelId: string;
  checkIn: string;
  checkOut: string;
}
export async function getAvailableRoomTypes({
  branchHotelId,
  checkIn,
  checkOut,
}: getAvailableRoomTypesInput) {
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const now = new Date();
  if (ci >= co) {
    throw new Error('check-out date must be after check-in date');
  }

  const rooms = await prisma.room.findMany({
    where: { branchHotelId },
    select: {
      id: true,
      type: true,
      price: true,
    },
  });

  const grouped: Record<string, { type: string; price: number; availableCount: number }> = {};

  for (const room of rooms) {
    if (!grouped[room.type]) {
      grouped[room.type] = {
        type: room.type,
        price: room.price,
        availableCount: 0,
      };
    }
  }
  const availableRooms = await prisma.room.findMany({
    where: {
      branchHotelId,
      NOT: {
        bookings: {
          some: {
            AND: [
              { checkIn: { lt: co } },
              { checkOut: { gt: ci } },
              {
                OR: [
                  { status: 'CONFIRMED' },
                  {
                    AND: [{ status: 'PENDING' }, { expireAt: { gt: now } }],
                  },
                ],
              },
            ],
          },
        },
      },
    },
    select: {
      type: true,
    },
  });
  for (const room of availableRooms) {
    grouped[room.type].availableCount += 1;
  }
  return Object.values(grouped);
}
