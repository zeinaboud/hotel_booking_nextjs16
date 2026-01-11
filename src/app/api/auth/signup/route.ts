// src/app/api/auth/signup/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// اجعل هذا Route يعمل على Node runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1️⃣ جلب البيانات من body
    const body = await req.json();
    const { name, email, password } = body;

    // 2️⃣ تحقق من أن جميع الحقول موجودة
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // 3️⃣ تحقق إذا كان المستخدم موجود مسبقًا
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "المستخدم موجود مسبقًا" },
        { status: 400 }
      );
    }

    // 4️⃣ عمل hash لكلمة السر قبل الحفظ
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ إنشاء المستخدم في قاعدة البيانات
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // 6️⃣ إرجاع رسالة نجاح مع بيانات محدودة (لا ترسل كلمة السر)
    return NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json(
      { error: "حدث خطأ داخلي، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
