'use client';
import SideNav from '@/components/dashboard/sidenav';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    console.log('🚀 ~ layout.tsx ~ Layout ~ status:', status);


    console.log('🚀 ~ layout.tsx ~ Layout ~ data:', session);


    // التحقق من حالة الجلسة
    if (status === "loading") {
        return <div>Loading.. .. ..</div>;
    }

    // التحقق من صلاحيات المستخدم (طبقة حماية إضافية)
    if (!session || session.user.role !== "admin") {
        redirect("/");
    }
    return (
        <div className="flex h-[calc(100vh-60px)] flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{ children }</div>
        </div>
    );
}