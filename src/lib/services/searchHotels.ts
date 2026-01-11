import { prisma } from "@/lib/prisma";
import { BranchHotelSearch } from "../../types/hotelsType";

export async function searchHotelServices(
  name = "",
  opts: {
    checkIn?: string;
    checkOut?: string;
    ratingGte?: number,
    minPrice?: number,
    maxPrice?:number,
  } = {}
): Promise<{ data: BranchHotelSearch[] }> {

  const { checkIn, checkOut,ratingGte ,minPrice,maxPrice} = opts;

  // MAIN BRANCH FILTER
  const whereBranch: any = { AND: [] };

  if (name) {
    whereBranch.AND.push({
      OR: [
        { city: { contains: name, mode: "insensitive" } },
        { address: { contains: name, mode: "insensitive" } },
        { hotel: { name: { contains: name, mode: "insensitive" } } }, // هذه كانت غلط عندك
      ],
    });
  }

  if (typeof ratingGte === "number")
  {
    whereBranch.AND.push({ rating: { gte: ratingGte } });
  }
  // ROOMS FILTER
  const roomWhere: any = {};

  //price filter
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

    roomWhere.AND = [
      { available: true },
      {
        NOT: {
          bookings: {
            some: {
              AND: [
                { checkIn: { lt: co } },
                { checkOut: { gt: ci } },
              ],
            },
          },
        },
      },
    ];
  }

  // PRISMA QUERY
  const branches = await prisma.branchHotel.findMany({
    where: whereBranch.AND.length ? whereBranch : undefined,
    include: {
      hotel: true,
      rooms: {
        where: Object.keys(roomWhere).length ? roomWhere : undefined,
      },
      images:true,
    },
    orderBy: { createdAt: "desc" },
  });

  // FORMAT RESULT
  const data: BranchHotelSearch[] = branches.map((b) => ({
    id: b.id,
    hotelId: b.hotelId,
    hotelName: b.hotel?.name ?? "",
    city: b.city,
    address: b.address,
    rating: b.rating ?? null,
    images: b.images || [],
    rooms: b.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      price: r.price,
      available: r.available,
      type: r.type,
    })),
  }));

  return { data };
}
