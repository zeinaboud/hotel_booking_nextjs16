
/*import createCheckoutSession from "@/lib/services/createCheckoutSession";
import { NextResponse } from "next/server";
export async function POST(req: Request)
{
  const { bookingRequestId } = await req.json();

  try
  {
    const url = await createCheckoutSession(bookingRequestId);
    return NextResponse.json({ url });
  } catch (err: any)
  {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}*/
import { NextResponse } from 'next/server';

export async function POST(req: Request)
{
  return NextResponse.json({ success: true });
}


