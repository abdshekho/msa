import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    // الاتصال بقاعدة البيانات
    const { db } = await connectToDatabase();

    // البحث عن المستخدم الحالي
    const user = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { password: 0 } } // استبعاد كلمة المرور من النتائج
    );

    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدم:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب بيانات المستخدم" },
      { status: 500 }
    );
  }
}