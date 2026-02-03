// app/api/checkout/create-session/route.ts (أو المكان الذي تستدعي منه createCheckoutSession)
import createCheckoutSession from "@/lib/services/createCheckoutSession";
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
    console.error("create-session error:", err);
    // أثناء التطوير فقط: أعد معلومات الخطأ المفيدة للـ client
    const status = err?.statusCode || 400;
    const body = {
      message: err?.message || "Unknown error",
      stripeError: err?.raw || null,
    };
    return NextResponse.json(body, { status });
  }
}
