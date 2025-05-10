// @ts-nocheck
import React from 'react';
import styles from './ProductTable.module.css'; // أو CSS-in-JS

const ProductTable = () => {
    return (
        <div className={ styles.tableContainer }>
            <table className={ styles.productTable }>
                <thead>
                    <tr>
                        <th rowSpan="2">Modelo</th>
                        <th colSpan="6">SUN-SK-SG05 LP3-EU-SM2</th>
                    </tr>
                    <tr>
                        <th>SUN-SK-SG05 LP3-EU-SM2</th>
                        <th>SUN-SK-SG05 LP3-EU-SM2</th>
                        <th>SUN-SK-SG05 LP3-EU-SM2</th>
                        <th>SUN-10K-SG05 LP3-EU-SM2</th>
                        <th>SUN-12K-SG05 LP3-EU-SM2</th>
                        <th>SUN-12K-SG05 LP3-EU-SM2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={ styles.sectionHeader }>
                        <td colSpan="7">Battery Input Data</td>
                    </tr>
                    <tr>
                        <td>Battery Type</td>
                        <td colSpan="6">Lead-sold or Lithium-ion</td>
                    </tr>
                    <tr>
                        <td>Battery Voltage Range (V)</td>
                        <td colSpan="6">40-60</td>
                    </tr>
                    <tr>
                        <td>Max. Charging Current (A)</td>
                        <td>70</td>
                        <td>95</td>
                        <td>120</td>
                        <td>135</td>
                        <td>190</td>
                        <td>210</td>
                    </tr>
                    {/* استمر بإضافة بقية الصفوف بنفس النمط */ }
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;