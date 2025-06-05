'use client';
import SideNav from '@/components/dashboard/sidenav';
// import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";


export default function Layout({ children }: { children: React.ReactNode }) {
    // const { data: session, status } = useSession();


    const lang = usePathname().slice(1,3) || 'en';


    // // التحقق من حالة الجلسة
    // if (status === "loading") {
    //     return <div>Loading.. .. ..</div>;
    // }

    // // التحقق من صلاحيات المستخدم (طبقة حماية إضافية)
    // if (!session || session.user.role !== "admin") {
    //     redirect("/");
    // }
    return (
        <div className="flex h-[calc(100vh-60px)] flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav lang={lang}/>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{ children }</div>
        </div>
    );
}