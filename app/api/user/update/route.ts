import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

async function deleteImageFile(imageUrl: string) {
  try {
    if (!imageUrl) return;

    // Extract the file path from the URL
    // The URL format is like: /en/uploads/Products/filename.webp
    const relativePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    // Check if file exists before attempting to delete
    if (fs.existsSync(absolutePath)) {
      await fsPromises.unlink(absolutePath);
      console.log(`Deleted image file: ${absolutePath}`);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
    // We don't throw here to allow the Product deletion to continue
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // console.log('🚀 ~ route.ts ~ PUT ~ session:', session);


    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    const { name, phone, address, image } = await request.json();

    // الاتصال بقاعدة البيانات
    const { db } = await connectToDatabase();
    const oldUser = await db.collection("users").findOne({ email: session.user.email })

    if (image && oldUser?.image && oldUser.image !== image) {
      await deleteImageFile(oldUser.image);
    }


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