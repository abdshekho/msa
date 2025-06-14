import AddToCartButton from '@/components/products/AddToCartButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ProdcutCard({ product, lang }:any) {
    return (
        <div key={ product._id } className="flex flex-col justify-between bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <Link href={ `/${lang}/products/${product._id}` }>
                <div className="relative h-48 w-full">
                    <Image
                        src={ product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}` }
                        alt={ product.name }
                        fill
                        className="object-contain hover:opacity-80"
                    />
                </div>
            </Link>
            <div className="p-4">
                <h3 className="font-semibold text-lg my-6 text-center text-primary dark:text-primary-10">
                    { product.name }
                </h3>
                <div className='flex justify-between items-center'>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">${ product.price.toFixed(2) }</span>
                    <AddToCartButton productId={ product._id.toString() } lang={ lang } className='text-base flex items-center gap-2 text-white bg-green-600 dark:bg-green-700 px-2 py-2 rounded-lg' />
                </div>
            </div>
        </div>
    )
}

export default ProdcutCard