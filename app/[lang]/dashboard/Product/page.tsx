//@ts-nocheck
'use client'
import ProductForm from '@/components/Admin/ProductForm'
import React from 'react'

export default function page({ searchParams }: any) {
    const { id } = React.use(searchParams)
    return (
        <div>
            { id ? (
                <ProductForm productId={ id } />
            ) : (
                <ProductForm />
            ) }
        </div>
    )
}
{/* <ProductForm productId="681f939dafe163afdf9e5f7e" /> */ }
