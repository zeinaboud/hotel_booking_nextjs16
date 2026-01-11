import { searchHotelServices } from "@/lib/services/searchHotels";
import { NextResponse } from "next/server";


export async function GET(req: Request)
{
  try
  {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") ?? "";
    const checkIn = url.searchParams.get("checkIn") ?? "";
    const checkOut = url.searchParams.get("checkOut") ?? "";
    const  minPrice= url.searchParams.get("minPrice") ?? "";
    const maxPrice = url.searchParams.get("maxPrice") ?? "";
    const ratingGte = url.searchParams.get("ratingGte") ?? "";

    const { data } = await searchHotelServices(name, {
      checkIn,
      checkOut,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      ratingGte: ratingGte ? Number(ratingGte) : undefined
    })
    return NextResponse.json({data});
  } catch (err)
  {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}
