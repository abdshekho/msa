import AddToCartButton from '@/components/products/AddToCartButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaEye, FaTag } from 'react-icons/fa'
import { useBrands } from '@/context/BrandContext'

function ProductCard({ product, lang }: any) {
    const { brands: contextBrands, loading: loadingBrands }: any = useBrands();
    const brandName = contextBrands.find((brand: any) => brand._id.toString() === product.brand.toString())?.name;
    return (
        <div
            key={ product._id }
            // className="group relative bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-1 transition-all duration-500 ease-out"
            className="group relative rounded-3xl bg-gray-100 dark:bg-slate-800 p-1 transition-all duration-500 ease-out"
        >
            {/* Animated Border */ }
            {/* <div className="absolute inset-0 bg-gradient-to-r rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */ }

            <div className="relative bg-gray-100 dark:bg-slate-800 rounded-3xl overflow-hidden h-full flex flex-col">
                {/* Header Section */ }
                {/* <div className="relative"> */ }


                {/* Image Container */ }
                <Link href={ `/${lang}/products/${product._id}` }>
                    {/* <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden"> */ }
                    <div className="relative h-64 bg-white overflow-hidden">
                        <Image
                            src={ product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}` }
                            alt={ product.name }
                            fill
                            className="object-contain transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                        />
                        {/* Geometric Overlay */ }
                        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */ }
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-10 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                </Link>
                {/* </div> */ }

                {/* Content Section */ }
                <div className="p-2 flex-1 flex flex-col">
                    {/* Product Category */ }
                    {/* <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            { product.category || 'منتج' }
                        </span>
                    </div> */}

                    
                    {/* Product Name */ }
                    <h3 className="font-bold text-center text-lg my-3 text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                        { product.name }
                    </h3>

                    {/* Brand */ }
                    { product.brand && contextBrands && !loadingBrands && brandName && (
                        <div className='flex gap-1 items-center'>
                            {/* <div className="w-2 h-2 bg-primary rounded-full"></div> */}
                            <span className="head-23 mx-1 flex gap-1 items-center">
                                <FaTag />
                                { lang === 'ar' ? 'العلامة التجارية:' : 'Brand:' }
                            </span>
                            <Link href={ `/${lang}/brands/${brandName}` } className="text-sm hover:text-blue-600 dark:hover:text-secondary hover:underline">
                                { brandName }
                            </Link>
                        </div>
                    ) }



                    {/* Features */ }
                    <div className="flex flex-wrap gap-1 my-4 justify-between">
                        { (product.features || ['جودة عالية', 'توصيل سريع']).slice(0, 2).map((feature: string, index: number) => (
                            <span key={ index } className="text-xs bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">
                                { feature }
                            </span>
                        )) }
                    </div>




                    {/* Price Section */ }
                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-3">
                            { product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-slate-400 line-through">
                                    ${ product.originalPrice.toFixed(2) }
                                </span>
                            ) }
                            <div className="text-center">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                                    ${ product.price.toFixed(2) }
                                </span>
                                <div className="w-16 h-1 bg-gradient-to-r from-primary to-pink-500 mx-auto mt-1 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */ }
                    <div className="mt-auto space-y-3">
                        <AddToCartButton
                            productId={ product._id.toString() }
                            lang={ lang }
                            classNameIcon={ 'cartIcon' }
                            className="cartBtn w-full bg-secondary dark:bg-secondary text-white font-bold py-3 px-6 rounded-2xl hover:bg-white hover:text-primary dark:hover:bg-white dark:hover:text-primary transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                        />

                        <Link href={ `/${lang}/products/${product._id}` } className="group/btn w-full border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-2.5 px-6 rounded-2xl hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                            <FaEye className='group-hover/btn:rotate-180 group-hover/btn:scale-125 transition-transform' />
                            { lang === 'en' ? 'View Details' : 'عرض التفاصيل' }
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard