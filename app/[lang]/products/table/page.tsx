import React from 'react'
import ProductTable2 from '../../../../components/products/ProductTabel2'
import ProductTable from '../../../../components/products/ProductTabel'

export default function TablePage() {
    return (
        <div>
            <ProductTable2 />
            <div className='h-50'></div>
            <ProductTable />
        </div>
    )
}
