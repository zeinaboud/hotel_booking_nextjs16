/**
 * API Route: GET /api/hotel/[id]
 *
 * Description:
 * This endpoint returns detailed information about a single hotel.
 * It is intended to be used in server-side or client-side data fetching.
 *
 * How it works:
 * - Extracts the hotel ID from the dynamic route parameters.
 * - Uses getHotelDetailsService(id) to fetch hotel data from the data layer.
 * - Responds with the hotel details in JSON format.
 *
 * Reusability Notes:
 * - The service layer (getHotelDetailsService) is separated from the route
 *   so the same logic can be reused in other parts of the application
 *   or even in other applications that share the same data structure.
 * - Error handling is standardized to return a JSON response with status 500.
 *
 */

import { getHotelDetailsService } from "@/lib/services/getHotelDetailsService";
import { NextResponse } from "next/server";

export async function GET(req:Request, { params }: { params: { id: string }}) {
  try
  {
    const resolve = await params;
    const id = resolve.id;
    const url = new URL(req.url);
    const checkIn = url.searchParams.get("checkIn") ?? "";
    const checkOut = url.searchParams.get("checkOut") ?? "";
    const type = url.searchParams.get("type") ?? "";
    const hotel = await getHotelDetailsService(id,{checkIn,checkOut,type});
    return NextResponse.json(hotel);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
