import { prisma } from '@/lib/prisma';

export interface RoomTypeItem {
  type: string;
  price: number;
  availableQuantity: number;
  rooms: any[]; // array of actual room objects
}

export async function getHotelDetailsService(
  branchHotelId: string,
  opts: { checkIn?: string; checkOut?: string; type?: string } = {},
) {
  const { checkIn, checkOut, type } = opts;

  if (!branchHotelId) throw new Error('BranchHotel ID is required');

  // 1️⃣ جلب كل الغرف للفرع، optionally filter by type
  const allRooms = await prisma.room.findMany({
    where: {
      branchHotelId,
      ...(type ? { type: type.toUpperCase() } : {}),
    },
  });

  if (allRooms.length === 0) {
    // لا توجد غرف إطلاقاً
    const branchHotel = await prisma.branchHotel.findUnique({
      where: { id: branchHotelId },
      include: { hotel: true, images: true, amenities: true },
    });
    return { ...branchHotel, rooms: [] };
  }

  // 2️⃣ تحويل checkIn/checkOut إلى Dates صحيحة
  let ci: Date | null = null;
  let co: Date | null = null;

  if (checkIn && checkOut) {
    ci = new Date(checkIn);
    co = new Date(checkOut);
    ci.setHours(0, 0, 0, 0);
    co.setHours(23, 59, 59, 999);

    if (isNaN(ci.getTime()) || isNaN(co.getTime()) || ci >= co) {
      throw new Error('Invalid check-in/check-out dates');
    }
  }

  // 3️⃣ جلب كل BookingItems المرتبطة بالغرف الموجودة
  const bookingItems = await prisma.bookingItem.findMany({
    where: {
      roomId: { in: allRooms.map((r) => r.id) },
      bookingRequest: {
        is: {
          status: { in: ['CONFIRMED', 'PENDING'] },
          ...(ci && co
            ? {
                OR: [
                  { checkIn: { lt: co }, checkOut: { gt: ci }, status: 'CONFIRMED' },
                  {
                    checkIn: { lt: co },
                    checkOut: { gt: ci },
                    status: 'PENDING',
                    expireAt: { gte: new Date() },
                  },
                ],
              }
            : {}),
        },
      },
    },
  });

  // 4️⃣ إنشاء خريطة الغرف حسب النوع
  const roomMap: Record<string, RoomTypeItem> = {};

  allRooms.forEach((room) => {
    const bookedQty = bookingItems
      .filter((b) => b.roomId === room.id)
      .reduce((sum, b) => sum + b.quantity, 0);

    const availableQty = room.totalQuantity - bookedQty;

    if (!roomMap[room.type]) {
      roomMap[room.type] = {
        type: room.type,
        price: room.price,
        availableQuantity: 0,
        rooms: [],
      };
    }

    roomMap[room.type].availableQuantity += availableQty;
    roomMap[room.type].rooms.push({ ...room, availableQty });
  });

  // 5️⃣ جلب تفاصيل الفرع بالكامل
  const branchHotel = await prisma.branchHotel.findUnique({
    where: { id: branchHotelId },
    include: { hotel: true, images: true, amenities: true },
  });

  return {
    ...branchHotel,
    rooms: Object.values(roomMap),
  };
}
