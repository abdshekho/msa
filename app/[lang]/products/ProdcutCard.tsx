import AddToCartButton from '@/components/products/AddToCartButton'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ProductCard({ product, lang }: any) {
    return (
        <div 
            key={product._id} 
            // className="group relative bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-1 transition-all duration-500 ease-out"
            className="group relative rounded-3xl bg-gray-100 dark:bg-slate-800 p-1 transition-all duration-500 ease-out"
        >
            {/* Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-gray-100 dark:bg-slate-800 rounded-3xl overflow-hidden h-full flex flex-col">
                {/* Header Section */}
                <div className="relative">
                    {/* Quick Action Buttons */}
                    {/* <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                        <div className="flex gap-2">
                            {product.isNew && (
                                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    جديد
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    -{product.discount}%
                                </span>
                            )}
                        </div>
                        <button className="bg-white/90 dark:bg-slate-700/90 p-2 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 hover:rotate-12">
                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div> */}

                    {/* Image Container */}
                    <Link href={`/${lang}/products/${product._id}`}>
                        {/* <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden"> */}
                        <div className="relative h-64 bg-white overflow-hidden">
                            <Image
                                src={product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}`}
                                alt={product.name}
                                fill
                                className="object-contain transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                            />
                            {/* Geometric Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                            {/* <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-10 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    </Link>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Product Category */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {product.category || 'منتج'}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                        {product.name}
                    </h3>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {(product.features || ['جودة عالية', 'توصيل سريع']).slice(0, 2).map((feature: string, index: number) => (
                            <span key={index} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* Rating and Reviews */}
                    {/* <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="relative">
                                        <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        {i < (product.rating || 4) && (
                                            <svg className="w-4 h-4 text-yellow-400 absolute top-0 left-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
                                {product.rating || 4.0}
                            </span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            {product.reviewsCount || 0} تقييم
                        </span>
                    </div> */}

                    {/* Price Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-center gap-3">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-slate-400 line-through">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                            <div className="text-center">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                                    ${product.price.toFixed(2)}
                                </span>
                                <div className="w-16 h-1 bg-gradient-to-r from-primary to-pink-500 mx-auto mt-1 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-3">
                        <AddToCartButton 
                            productId={product._id.toString()} 
                            lang={lang} 
                            className="w-full bg-secondary dark:bg-secondary text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 dark:hover:bg-white dark:hover:text-primary transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                        />
                        
                        <button className="w-full border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-2xl hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            معاينة سريعة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard