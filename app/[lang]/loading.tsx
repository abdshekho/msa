import React from 'react';

export default function HomeLoading() {
  return (
    <div className="relative" style={{direction:'ltr'}}>
      {/* Hero Carousel skeleton */}
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      
      {/* Featured Categories skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Featured Products skeleton */}
      <div className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Partner Logos skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse"></div>
        <div className="flex flex-wrap justify-center gap-8">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-32 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* About Section skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="md:w-1/2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Call to Action skeleton */}
      <div className="w-full py-16 bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto mb-8 animate-pulse"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-32 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}