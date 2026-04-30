import { prisma } from '@/lib/prisma';
import { BranchHotelSearch } from '../../types/hotelsType';

export async function searchHotelServices(
  name = '',
  opts: {
    checkIn?: string;
    checkOut?: string;
    ratingGte?: number;
    minPrice?: number;
    maxPrice?: number;
    skip?: number;
    take?: number;
  } = {},
): Promise<{ data: BranchHotelSearch[]; total: number }> {
  const { checkIn, checkOut, ratingGte, minPrice, maxPrice, skip, take } = opts;

  // MAIN BRANCH FILTER
  const whereBranch: any = { AND: [] };

  if (name) {
    whereBranch.AND.push({
      OR: [
        { city: { contains: name, mode: 'insensitive' } },
        { address: { contains: name, mode: 'insensitive' } },
        { hotel: { name: { contains: name, mode: 'insensitive' } } }, // هذه كانت غلط عندك
      ],
    });
  }

  if (typeof ratingGte === 'number') {
    whereBranch.AND.push({ rating: { equals: ratingGte } });
  }
  // ROOMS FILTER
  const roomWhere: any = {};

  // PRICE FILTER
  if (minPrice !== undefined || maxPrice !== undefined) {
    roomWhere.price = {};

    if (minPrice !== undefined) {
      roomWhere.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      roomWhere.price.lte = maxPrice;
    }
  }
  if (checkIn && checkOut) {
    const ci = new Date(checkIn);
    const co = new Date(checkOut);

    roomWhere.NOT = {
      bookings: {
        some: {
          bookingRequest: {
            AND: [{ checkIn: { lt: co } }, { checkOut: { gt: ci } }],
          },
        },
      },
    };
  }
  // PRISMA QUERY
  const branches = await prisma.branchHotel.findMany({
    where: whereBranch.AND.length ? whereBranch : undefined,
    include: {
      hotel: true,
      rooms: {
        where: Object.keys(roomWhere).length ? roomWhere : undefined,
      },
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // FILTER BRANCHES WITH NO AVAILABLE ROOMS WHEN DATES ARE PROVIDED
  const branchesWithRooms =
    checkIn && checkOut ? branches.filter((b) => b.rooms.length > 0) : branches;

  // APPLY PAGINATION AND FORMAT RESULT
  const paginatedBranches = branchesWithRooms.slice(skip || 0, (skip || 0) + (take || 10));

  const data: BranchHotelSearch[] = paginatedBranches.map((b) => ({
    id: b.id,
    hotelId: b.hotelId,
    hotelName: b.hotel?.name ?? '',
    city: b.city,
    address: b.address,
    rating: b.rating ?? null,
    images: b.images || [],
    rooms: b.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      price: r.price,
      type: r.type,
    })),
  }));

  return { data, total: branchesWithRooms.length };
}
