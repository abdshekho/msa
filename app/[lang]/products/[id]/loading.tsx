import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Product detail section skeleton */ }
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product image gallery skeleton */ }
          <div className="md:w-1/2">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
            <div className="flex gap-2 mt-4">
              { [...Array(4)].map((_, index) => (
                <div key={ index } className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              )) }
            </div>
          </div>

          {/* Product info skeleton */ }
          <div className="md:w-1/2">
            {/* Title skeleton */ }
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-10 animate-pulse mx-auto"></div>

            {/* description skeleton */ }
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-[100px] mb-4 animate-pulse"></div>
            <div className="mb-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </div>
            {/* Features */ }
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-[100px] mb-4 animate-pulse"></div>
            { [...Array(6)].map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
            )) }
            {/* Brand and category */ }
            <div className='flex justify-between items-center my-6'>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-[200px] mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-[200px] mb-4 animate-pulse"></div>
            </div>



            {/* {/* Rating skeleton */ }
            {/* <div className="flex items-center mb-6">
              <div className="flex">
                { [...Array(5)].map((_, index) => (
                  <div key={ index } className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-1 animate-pulse"></div>
                )) }
              </div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-2 animate-pulse"></div>
            </div> */}

            {/* Description skeleton */ }
            {/* <div className="mb-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </div> */}

            {/* Specifications skeleton */ }
            {/* <div className="mb-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                { [...Array(4)].map((_, index) => (
                  <div key={ index } className="flex">
                    <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
                    <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                )) }
              </div>
            </div>  */}

            {/* Add to cart button skeleton */ }
            <div className="flex justify-between">
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className='my-30'>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse"></div>
        <div className="h-150 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
      </div>


      {/* Related products skeleton */ }
      <div className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          { [...Array(4)].map((_, index) => (
            <div key={ index } className="bg-white dark:bg-gray-700 rounded-lg shadow-md h-64 animate-pulse"></div>
          )) }
        </div>
      </div>
    </div>
  );
}