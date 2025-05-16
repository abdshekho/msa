import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  


  // التحقق مما إذا كان المسار يبدأ بـ /dashboard
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  
  // إذا كان المسار للوحة التحكم ولكن المستخدم ليس مسؤولاً أو غير مسجل دخول
  if (isDashboard && (!session || session.role !== 'admin')) {
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    const locale = request.nextUrl.pathname.split('/')[1] || 'ar';
    return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
  }
  
  return NextResponse.next();
}

// تطبيق الـ middleware على المسارات المحددة فقط
export const config = {
  matcher: ['/dashboard/:path*']
};