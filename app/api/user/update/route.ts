import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    const { name, phone, address, image } = await request.json();

    // الاتصال بقاعدة البيانات
    const { db } = await connectToDatabase();

    // تحديث بيانات المستخدم
    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          phone,
          address,
          image,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { message: "تم تحديث البيانات بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("خطأ في تحديث بيانات المستخدم:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 }
    );
  }
}