import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request)
{
  const { searchParams } = new URL(req.url)
  const hotelName = searchParams.get("hotelName") ?? ""

  const branches = await prisma.branchHotel.findMany({
    where: {
      hotel: { name: { contains: hotelName, mode: 'insensitive' } }
    }
  })
  return NextResponse.json(branches);
}
