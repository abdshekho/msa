'use client';

import React, { useState } from 'react';

type TableRow = {
    parameter: string;
    values: string[];
    isSectionHeader?: boolean;
};

export default function AdminTablePage() {
    const [headers, setHeaders] = useState<string[]>([
        'Model',
        'SUN-BK60SG01-EU-AM2',
        'SUN-BK80SG01-EU-AM2',
        'SUN-BK100SG01-EU-AM2',
    ]);

    const [rows, setRows] = useState<TableRow[]>([
        {
            "parameter": "Battery Input Data",
            "values": [
                "",
                "",
                ""
            ],
            "isSectionHeader": true
        },
        {
            "parameter": "Battery Type",
            "values": [
                "Lead-acid or Lithium-ion",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Battery Voltage Range (V)",
            "values": [
                "40-60",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Max. Charging Current (A)",
            "values": [
                "25",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Max. Discharging Current (A)",
            "values": [
                "25",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Charging Strategy forLi-ion Battery",
            "values": [
                "Self-adaption to BMS",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Number of Battery Input",
            "values": [
                "1",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "PV String Input Data",
            "values": [
                "",
                "",
                ""
            ],
            "isSectionHeader": true
        },
        {
            "parameter": "Max. PV Access Power (W)",
            "values": [
                "1320",
                "1760",
                "2200"
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Max. PV Input Power (W)",
            "values": [
                "960",
                "1280",
                "1600"
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Max. PV Input Voltage (V)",
            "values": [
                "60",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Start-up Voltage (V)",
            "values": [
                "25",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "MPPT Voltage Range (V)",
            "values": [
                "20-55",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Rated PV Input Voltage (V)",
            "values": [
                "42.5",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Max. Operating PV Input Current (A)",
            "values": [
                "18+18",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "Max. Input Short-Circuit Current (A)",
            "values": [
                "27+27",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "No. of MPP Trackers/ No. of StringsperMPP Tracker",
            "values": [
                "2/1",
                "",
                ""
            ],
            "isSectionHeader": false
        },
        {
            "parameter": "AC Input/Output Data",
            "values": [
                "",
                "",
                ""
            ],
            "isSectionHeader": true
        }
    ]);

    // إضافة عمود
    const addHeader = () => {
        setHeaders((prev) => [...prev, `Column ${prev.length}`]);
        setRows((prevRows) =>
            prevRows.map((row) => ({
                ...row,
                values: [...row.values, ''],
            }))
        );
    };

    // حذف عمود
    const removeHeader = (index: number) => {
        if (headers.length <= 1) return;

        const newHeaders = [...headers];
        newHeaders.splice(index, 1);
        setHeaders(newHeaders);

        setRows((prevRows) =>
            prevRows.map((row) => {
                const newValues = [...row.values];
                newValues.splice(index - 1, 1);
                return { ...row, values: newValues };
            })
        );
    };

    // تعديل عنوان العمود
    const handleHeaderChange = (index: number, value: string) => {
        const newHeaders = [...headers];
        newHeaders[index] = value;
        setHeaders(newHeaders);
    };

    // إضافة صف بعد صف معين
    const addRowAfter = (index: number) => {
        const newRow: TableRow = {
            parameter: '',
            values: Array(headers.length - 1).fill(''),
            isSectionHeader: false,
        };

        const newRows = [...rows];
        newRows.splice(index + 1, 0, newRow);
        setRows(newRows);
    };

    // حذف صف
    const removeRow = (index: number) => {
        setRows((prevRows) => prevRows.filter((_, i) => i !== index));
    };

    // تعديل اسم الخاصية
    const handleParameterChange = (rowIndex: number, value: string) => {
        const newRows = [...rows];
        newRows[rowIndex].parameter = value;
        setRows(newRows);
    };

    // تعديل قيمة في جدول
    const handleValueChange = (
        rowIndex: number,
        colIndex: number,
        value: string
    ) => {
        const newRows = [...rows];
        newRows[rowIndex].values[colIndex] = value;
        setRows(newRows);
    };

    // تبديل عنوان قسم
    const toggleSectionHeader = (index: number) => {
        const newRows = [...rows];
        newRows[index].isSectionHeader = !newRows[index].isSectionHeader;
        setRows(newRows);
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">🧩 إدارة بيانات الجدول</h1>

            {/* العناوين */ }
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">📌 العناوين:</h2>
                { headers.map((header, index) => (
                    <div key={ index } className="flex gap-2 items-center">
                        <input
                            className="border px-2 py-1 rounded w-60"
                            value={ header }
                            onChange={ (e) => handleHeaderChange(index, e.target.value) }
                            placeholder={ `Header ${index}` }
                        />
                        { index > 0 && (
                            <button
                                className="text-red-600 hover:underline"
                                onClick={ () => removeHeader(index) }
                            >
                                حذف
                            </button>
                        ) }
                    </div>
                )) }
                <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={ addHeader }
                >
                    ➕ إضافة عمود
                </button>
            </div>

            {/* الصفوف */ }
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">📋 الصفوف:</h2>
                <div className={ `flex flex-wrap gap-2 items-center p-2 w- rounded bg-cyan-100`}>

                    { headers.map((val, colIndex) => (
                        <div className={`border px-2 py-1 rounded  ${colIndex?'w-[210px]':'w-[400px]'}`}>{val}</div>
                        // <input
                        //     key={ colIndex }
                        //     className="border px-2 py-1 rounded w-36"w
                        //     value={ val }
                        //     onChange={ (e) =>
                        //         handleValueChange(rowIndex, colIndex, e.target.value)
                        //     }
                        //     placeholder={ `قيمة ${colIndex + 1}` }
                        // />
                    )) }
                </div>
                { rows.map((row, rowIndex) => (
                    <div
                        key={ rowIndex }
                        className={ `flex flex-wrap gap-2 items-center p-2 rounded ${row.isSectionHeader ? 'bg-cyan-100' : 'bg-gray-100'
                            }` }
                    >
                        <input
                            className="border px-2 py-1 rounded font-semibold w-[400px]"
                            value={ row.parameter }
                            onChange={ (e) => handleParameterChange(rowIndex, e.target.value) }
                            placeholder="اسم الخاصية"
                        />
                        { row.values.map((val, colIndex) => (
                            <input
                                key={ colIndex }
                                className="border px-2 py-1 rounded w-[210px]"
                                value={ val }
                                onChange={ (e) =>
                                    handleValueChange(rowIndex, colIndex, e.target.value)
                                }
                                placeholder={ `قيمة ${colIndex + 1}` }
                            />
                        )) }
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={ () => toggleSectionHeader(rowIndex) }
                        >
                            { row.isSectionHeader ? '📄 صف عادي' : '🟦 عنوان قسم' }
                        </button>
                        <button
                            className="text-green-600 hover:underline"
                            onClick={ () => addRowAfter(rowIndex) }
                        >
                            ➕ تحت هذا
                        </button>
                        <button
                            className="text-red-600 hover:underline"
                            onClick={ () => removeRow(rowIndex) }
                        >
                            حذف
                        </button>
                    </div>
                )) }
                <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={ () => addRowAfter(rows.length - 1) }
                >
                    ➕ إضافة صف أخير
                </button>
            </div>

            {/* مخرجات */ }
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">📦 البيانات النهائية:</h2>
                <pre className="bg-gray-200 p-4 rounded overflow-x-auto text-sm">
                    { JSON.stringify({ headers, rows }, null, 2) }
                </pre>
            </div>
        </div>
    );
}
