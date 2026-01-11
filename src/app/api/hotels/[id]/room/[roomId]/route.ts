import { getRoomById } from '@/lib/services/getRoomById';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string, roomId: string } }) {
  try {
    const hotelId = params.id;
    const roomId = params.roomId;

    const room = await getRoomById(roomId, hotelId);

    return NextResponse.json(room);
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
