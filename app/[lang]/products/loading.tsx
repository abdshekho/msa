import React from 'react';

export default function ProductsLoading() {
  return (
    <div className='relative container mx-auto'>
      <div className="h-12 w-[200px] bg-gray-300 dark:bg-gray-600 rounded my-8 animate-pulse mx-auto"></div>
      {/* Hero section skeleton */ }
      <div className="h-[400px] md:h-[232px] px-10 my-10 bg-gray-200 dark:bg-gray-700 animate-pulse flex flex-col justify-around items-center">
        <div className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded mb-4 animate-pulse"></div>
        <div className="flex flex-col md:flex-row justify-between w-full gap-2 md:gap-0">
          <div className="h-12 w-full md:w-1/5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="h-12 w-full md:w-1/5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="h-12 flex justify-between w-full md:w-1/5">
            <div className="h-12 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-12 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-12 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="h-12 flex justify-end w-full md:w-1/5">
            <div className="h-12 w-30 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            {/* <div className="h-12 w-30 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div> */ }
          </div>
        </div>
      </div>


      {/* Products grid skeleton */ }
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          { [...Array(8)].map((_, index) => (
            <div key={ index } className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-80 animate-pulse">
              {/* Product image skeleton */ }
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>

              {/* Product details skeleton */ }
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          )) }
        </div>

        {/* Pagination skeleton */ }
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            { [...Array(5)].map((_, index) => (
              <div key={ index } className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            )) }
          </div>
        </div>
      </div>
    </div>
  );
}