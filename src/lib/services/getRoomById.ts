import { prisma } from "@/lib/prisma";
export async function getRoomById(roomId: string,hotelId:string)
{


  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      branchHotelId:hotelId

    },
    include: {
      branchHotel: {
        include: {
          hotel: true
        },
      },
      bookings:true
    }
  });
  if (!room) throw new Error("room not found");
  return room;
}
