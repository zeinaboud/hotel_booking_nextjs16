import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getHotelsContext(): Promise<string> {
  const hotels = await prisma.hotel.findMany({
    include: {
      branchHotels: {
        include: {
          rooms: true,
          amenities: true,
        },
      },
    },
  });

  if (hotels.length === 0) {
    return 'No hotel data available currently.';
  }

  let context = 'AVAILABLE HOTELS DATA:\n\n';

  for (const hotel of hotels) {
    for (const branch of hotel.branchHotels) {
      context += `Hotel: ${hotel.name} - Branch: ${branch.city}\n`;
      context += `Address: ${branch.address}, ${branch.street}\n`;
      if (branch.rating) context += `Rating: ${branch.rating}/5\n`;
      if (branch.description) context += `Description: ${branch.description}\n`;

      if (branch.amenities.length > 0) {
        const amenitiesList = branch.amenities.map((a) => `${a.name} (${a.count})`).join(', ');
        context += `Amenities: ${amenitiesList}\n`;
      }

      if (branch.rooms.length > 0) {
        context += `Rooms:\n`;
        for (const room of branch.rooms) {
          context += `  - Name: ${room.name} | Type: ${room.type} | Price: $${room.price}/night | Available: ${room.totalQuantity}\n`;
        }
      } else {
        context += `No rooms registered for this branch yet.\n`;
      }

      context += '\n';
    }
  }

  return context;
}

export async function findBranchId(hotelName: string, city: string): Promise<string | null> {
  const branch = await prisma.branchHotel.findFirst({
    where: {
      city: { contains: city, mode: 'insensitive' },
      hotel: {
        name: { contains: hotelName, mode: 'insensitive' },
      },
    },
  });

  return branch?.id || null;
}
