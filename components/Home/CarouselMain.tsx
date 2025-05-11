import React from 'react'
import { Carousel } from "flowbite-react";

export default function CarouselMain() {
    return (
        // <div className="h-full sm:h-100 xl:h-120 2xl:h-160">
        <div className="h-[70vh]">
            <Carousel>
                <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
                    Slide 1
                </div>
                <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
                    Slide 2
                </div>
                <div className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
                    Slide 3
                </div>
            </Carousel>
        </div>
    )
}
