import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/app/lib/models/User";
import bcrypt from "bcrypt";
import connectDB from "@/app/lib/DB/mongoDB";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get the current session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    // Get request body
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Check if current password is correct
    if (!user.password) {
      return NextResponse.json(
        { message: "لا يمكن تغيير كلمة المرور للحسابات المسجلة عبر مزودي المصادقة الخارجية" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "كلمة المرور الحالية غير صحيحة" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "تم تغيير كلمة المرور بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تغيير كلمة المرور" },
      { status: 500 }
    );
  }
}