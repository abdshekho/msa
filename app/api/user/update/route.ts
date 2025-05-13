//@ts-nocheck
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "الاسم مطلوب" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // تحديث بيانات المستخدم
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { name } }
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