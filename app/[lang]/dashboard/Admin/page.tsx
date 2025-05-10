import React from 'react'
// import TableEditor from '../../components/Admin/TableEditor'
import TableEditorPage from '../../../../components/Admin/TableEditor'
// import AdminTableEditor from '../../components/Admin/AdminTableEditor'

export default function page() {
    return (
        <main className="max-w-8xl mx-auto py-10 direction-rtl">
            <h1 className="text-2xl font-bold mb-6 text-center">إدارة جدول البيانات</h1>
            {/* <AdminTableEditor /> */}
            <TableEditorPage />
        </main>
    )
}
