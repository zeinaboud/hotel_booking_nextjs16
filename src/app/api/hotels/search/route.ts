import { searchHotelServices } from '@/lib/services/searchHotels';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') ?? '';
    const checkIn = url.searchParams.get('checkIn') ?? '';
    const checkOut = url.searchParams.get('checkOut') ?? '';
    const minPrice = url.searchParams.get('minPrice') ?? '';
    const maxPrice = url.searchParams.get('maxPrice') ?? '';
    const ratingGte = url.searchParams.get('ratingGte') ?? '';

    // Pagination
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const { data, total } = await searchHotelServices(name, {
      checkIn,
      checkOut,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      ratingGte: ratingGte ? Number(ratingGte) : undefined,
      skip,
      take: limit,
    });

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
