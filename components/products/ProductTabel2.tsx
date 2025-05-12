// @ts-nocheck
import React from "react";
import styles from './ProductTable.module.css';
const ProductTable2 = ({tableDataProps}) => {

    console.log('🚀 ~ ProductTabel2.tsx ~ ProductTable2 ~ tableDataProps:', tableDataProps);

    
    function findEmptyValues(arr) {
        //  ["40-60", "", "", "", "", ""]
        const emptyPositions = arr.map((value, index) => {
            if (value === "") {
                return index;
            }
        }).filter(index => index !== undefined);
        return  emptyPositions.length
    }
    function analyzeEmptySequences(arr: string[]) {
        const sequences: Record<string, number> = {};

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '') {
                let emptyCount = 0;
                let j = i + 1;
                while (j < arr.length && arr[j] === '') {
                    emptyCount++;
                    j++;
                }
                sequences[arr[i]] = emptyCount;
            }
        }

        return sequences;
    }
    return (
        <div className="overflow-x-auto max-w-6xl m-auto">
            <table className={ styles.productTable }>
                <thead>
                    <tr>
                        {/* العناوين الرئيسية */ }
                        { tableDataProps.headers.map((header, index) => (
                            <th
                                key={ index }
                                className="border p-2 bg-gray-100 font-semibold text-center"
                                rowSpan={ index === 0 ? 2 : 1 }
                            >
                                { header }
                            </th>
                        )) }
                    </tr>
                </thead>
                <tbody>
                    { tableDataProps.rows.map((row, rowIndex) => {
                        if (row.isSectionHeader) {
                            // عنوان قسم (يمتد على كل الأعمدة)
                            return (
                                <tr key={ rowIndex } className="bg-gray-50">
                                    <td
                                        colSpan={ tableDataProps.headers.length }
                                        className={ styles.sectionHeader }
                                    >
                                        { row.parameter }
                                    </td>
                                </tr>
                            );
                        } else {
                            // صف عادي
                            return (
                                <tr key={ rowIndex }>
                                    <td className="border p-2 font-medium">{ row.parameter }</td>
                                    { row.values.map((value, colIndex) => {
                                        const hasEmptyValues = findEmptyValues(row.values) !== 0;
                                        const sequences = analyzeEmptySequences(row.values);

                                        if (hasEmptyValues && value) {
                                            return (
                                                <td
                                                    colSpan={ sequences[value] ? sequences[value] + 1 : 1 }
                                                    key={ colIndex }
                                                    className="border p-2 text-center"
                                                >
                                                    { value }
                                                </td>
                                            );
                                        }

                                        if (value) {
                                            return (
                                                <td
                                                    key={ colIndex }
                                                    className="border p-2 text-center"
                                                >
                                                    { value }
                                                </td>
                                            );
                                        }

                                        return null;
                                    }) }
                                </tr>
                            );
                        }
                    }) }
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable2;



export const tableData = {
    // العناوين الرئيسية للجدول
    headers: [
        "Model",
        "SUN-SK-SG05 LP3-EU-SM2",
        "SUN-SK-SG05 LP3-EU-SM2",
        "SUN-SK-SG05 LP3-EU-SM2",
        "SUN-10K-SG05 LP3-EU-SM2",
        "SUN-12K-SG05 LP3-EU-SM2",
        "SUN-12K-SG05 LP3-EU-SM2",
    ],

    // بيانات الجدول (الصفوف)
    rows: [
        // الصفوف العادية
        {
            parameter: "Battery Input Data",
            values: ["", "", "", "", "", ""],
            isSectionHeader: true, // عنوان قسم
        },
        {
            parameter: "Battery Type",
            values: ["Lead-sold or Lithium-ion", "", "", "", "", ""],
            isSectionHeader: false, // ليس عنوان قسم
        },
        {
            parameter: "Battery Voltage Range (V)",
            values: ["40-60", "", "", "60-80", "80-100", ""],
            isSectionHeader: false,
        },
        {
            parameter: "Max. Charging Current (A)",
            values: ["70", "95", "120", "135", "190", "210"],
            isSectionHeader: false,
        },
    ],
};