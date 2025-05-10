import React from 'react'

export default function alert() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-xl font-bold mb-4">تنبيه!</h3>
                <p className="mb-6">هل أنت متأكد من هذا الإجراء؟</p>
                <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-gray-200 rounded">إلغاء</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded">تأكيد</button>
                </div>
            </div>
        </div>
    )
}
