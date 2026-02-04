

/**
 *
 * Service: getHotelDetailsService
 *
 * Description:
 * Fetches full hotel details from the database using the provided hotel ID.
 * This service is separated from API routes to allow reuse across the system
 * including server components, API handlers, or background jobs.
 *
 * Parameters:
 * - id (string): The unique identifier of the hotel/branch record.
 *
 * Behavior:
 * - Validates that an ID was provided.
 * - Queries the database for a matching hotel record using Prisma.
 * - Includes related hotel information and room list in the response.
 *
 *
 * Returns:
 * - A hotel object containing:
 *   {
 *     id: string,
 *     hotel: {...},
 *     rooms: [...],
 *     ...other fields
 *   }
 * - Returns null if no matching hotel is found.
 */
import { prisma } from "@/lib/prisma";
export async function getHotelDetailsService(
  id: string,
  opts: {
    checkIn?: string,
    checkOut?: string,
    type?: string
  } = {}
)
{
  const { checkIn, checkOut, type } = opts
  {
    if (!id)
    {
      throw new Error("hotel id is required")
    }
    //room availability filter
    const roomWhere: any = {};
    if (type)
    {
      roomWhere.type = type.toUpperCase();
    }
    if (checkIn && checkOut)
    {
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
    const hotel = await prisma.branchHotel.findUnique({
      where: { id },
      include: {
        hotel: true,
        rooms: Object.keys(roomWhere).length ? { where: roomWhere } : true,
        images: true,
        amenities: true,
      }

    });
    return hotel;
  }
}
