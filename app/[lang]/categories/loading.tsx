import React from 'react';

export default function BrandsLoading() {
    return (
        <div className='relative' style={{direction:'ltr'}}>
            {/* Hero section skeleton */ }
            <div className="w-full h-[80vh] bg-gray-200 dark:bg-gray-700 animate-pulse flex flex-col-reverse lg:flex-row justify-between items-center pt-20 md:pt-1">
                <div className='w-full lg:w-1/2 mt-10 pt-20'>
                <div className="h-12 max-w-xl  mx-auto mb-8 flex justify-start">
                    <div className="h-12 w-90  bg-gray-300 dark:bg-gray-500 rounded  mb-8 animate-pulse"></div>
                </div>
                    <div className="h-35 bg-gray-300 dark:bg-gray-500 rounded max-w-xl mx-auto mb-12 animate-pulse"></div>
                    <div className='flex justify-start gap-4 h-30 max-w-xl   mx-auto mb-12'>
                        <div className="h-13 w-40  bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
                        <div className="h-13 w-45  bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>

                    </div>

                </div>
                <div className=" h-200 md:h-100 w-full  lg:w-1/2  bg-gray-300 dark:bg-gray-500 rounded  mr-0 lg:mr-30 mb-8 animate-pulse"></div>

            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Title skeleton */ }
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse"></div>

                {/* Description skeleton */ }
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded max-w-2xl mx-auto mb-12 animate-pulse"></div>

                {/* Brands grid skeleton */ }
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    { [...Array(10)].map((_, index) => (
                        <div
                            key={ index }
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-2 md:p-4 flex flex-col items-center">
                                {/* Image skeleton */ }
                                <div className="h-30 w-30 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

                                {/* Title skeleton */ }
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>

                                {/* Description skeleton */ }
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>

                                {/* Product count skeleton */ }
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    )) }
                </div>
            </div>
            <div className="custom-shape-divider-top-1747581643">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
        </div>
    );
}