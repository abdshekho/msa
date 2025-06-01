import React from 'react';

export default function SignUpLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
                {/* Title placeholder */ }
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>

                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>

                <div className="my-3 py-3 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-secondary dark:border-secondary-10"></div>
                    </div>
                </div>

                {/* Logo placeholder */ }
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>


                {/* Form fields */ }
                <div className="space-y-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>

                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>

                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>

                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>

                </div>

                {/* Social signup buttons */ }
                <div className="mt-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                </div>
            </div>
        </div>
    );
}