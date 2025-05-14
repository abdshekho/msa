import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, address, image } = await request.json();

    // التحقق من البيانات المدخلة
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "البريد الإلكتروني غير صالح" },
        { status: 400 }
      );
    }

    // التحقق من قوة كلمة المرور
    if (password.length < 6) {
      return NextResponse.json(
        { message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // الاتصال بقاعدة البيانات
    const { db } = await connectToDatabase();

    // التحقق من وجود المستخدم
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await hash(password, 10);

    // إنشاء المستخدم
    const result = await db.collection("users").insertOne({
      name,
      email,
      username: email.split('@')[0], // استخدام جزء من البريد الإلكتروني كاسم مستخدم
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      image: image || "/profile.webp",
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "تم إنشاء المستخدم بنجاح", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("خطأ في تسجيل المستخدم:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تسجيل المستخدم" },
      { status: 500 }
    );
  }
}