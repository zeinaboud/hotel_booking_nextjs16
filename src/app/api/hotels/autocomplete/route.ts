import { NextResponse } from "next/server";
import { prisma } from '../../../../lib/prisma';


export async function GET(req: Request)
{
  try
  {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q" || "")?.trim());
    if (!query)
    {
      return NextResponse.json([])
    }
    //search cities
    const cityResults = await prisma.branchHotel.findMany({
      where: { city: { contains: query, mode: "insensitive" } },
      select: { city: true },
      distinct: ["city"],
      take: 10,
    });
    //search hotels
    const hotelResults = await prisma.hotel.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 10,
    });

    const suggestions: { id: string; type: 'city' | 'hotel'; name?: string; city?: string; address?: string }[] = [];
      cityResults.forEach((c: any) => {
      suggestions.push({
        id: c.city,
        type: "city",
        city: c.city,
      });
    });
    hotelResults.forEach((h: any) => {
      suggestions.push({
        id: h.id,
        type: "hotel",
        name: h.name,
      });
    });
    return NextResponse.json(suggestions);
  } catch (err)
  {

    {
      console.error(err);
      return NextResponse.json({ error: "server error" }, { status: 500 })
    }

  }
}
