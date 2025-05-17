import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // التحقق من صحة المعرف
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "معرف المستخدم غير صالح" },
        { status: 400 }
      );
    }

    // الاتصال بقاعدة البيانات
    const { db } = await connectToDatabase();

    // البحث عن المستخدم
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } } // استبعاد كلمة المرور من النتائج
    );

    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من الصلاحيات (فقط المستخدم نفسه أو المسؤول يمكنه الوصول)
    if (user._id.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول لبيانات هذا المستخدم" },
        { status: 403 }
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