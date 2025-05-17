import React from 'react'
import { Carousel, createTheme, ThemeProvider } from "flowbite-react";
import Image from "next/image";

export default function CarouselMain() {
    const mainTheme = createTheme({
        "root": {
            "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-hidden scroll-smooth rounded-lg",

        }
    });
    return (
        <div className="h-[40vh] lg:h-[100vh]">
            <ThemeProvider theme={mainTheme}>
                <Carousel slide={false} className='overflow-x-hidden'>
                    <div className="relative overflow-x-hidden flex h-full items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-900 dark:to-blue-800">
                        <img
                            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1920&auto=format&fit=crop"
                            alt="الطاقة الشمسية للمنازل"
                            // className="object-fill opacity-60 h-full md:h-auto w-full"
                            className="opacity-40 h-full w-full"
                        />
                        <div className="absolute z-10 text-center text-white px-4 md:px-12 max-w-3xl">
                            <h2 className="text-xl lg:text-5xl font-bold mb-4 text-[lightblue]">حلول الطاقة الشمسية للمنازل</h2>
                            <p className="text-md lg:text-xl mb-6 text-[lightgrey]">وفر في فواتير الكهرباء واستثمر في مستقبل أكثر استدامة مع أنظمة الطاقة الشمسية عالية الكفاءة</p>
                            <button className="border border-white  hover:bg-[#053862] font-bold py-3 px-6 rounded-lg transition-all">
                                استكشف الحلول المنزلية
                            </button>
                            {/* <button role="button" className="golden-button">
                            <span className="golden-text">
                            استكشف الحلول المنزلية
                            </span>
                        </button> */}
                        </div>
                    </div>
                    <div className="relative flex h-full items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-900 dark:to-blue-800">
                        <img
                            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1920&auto=format&fit=crop"
                            alt="الطاقة الشمسية للمنازل"
                            // className="object-fill opacity-60 h-full md:h-auto w-full"
                            className="opacity-40 h-full w-full"
                        />
                        <div className="absolute z-10 text-center text-white px-4 md:px-12 max-w-4xl">
                            <h2 className="text-xl lg:text-5xl font-bold mb-4 text-[lightblue]">Sun Power Solution</h2>
                            <p className="text-md lg:text-xl mb-6 text-[lightgrey]">
                                Save on electricity bills and invest in a more sustainable future with high-quality solar energy systems.
                            </p>
                            <button className="border border-white  hover:bg-[#111827] font-bold py-3 px-6 rounded-lg transition-all">
                                Home solutions
                            </button>
                            {/* <button role="button" className="golden-button">
                            <span className="golden-text">
                            Home
                            </span>
                        </button> */}
                        </div>
                    </div>

                    <div className="relative flex h-full items-center justify-center bg-gradient-to-r from-[#111827] to-[#263452] dark:from-[#111827] dark:to-[#263452]">
                        <div className="custom-shape-divider-bottom-1747396217">
                            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
                                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
                                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
                            </svg>
                        </div>
                        <div className="absolute z-10 text-center text-white px-4 md:px-12 max-w-4xl">
                            <h2 className="text-xl lg:text-5xl font-bold mb-4 text-[lightblue]">Sun Power Solution</h2>
                            <p className="text-md lg:text-xl mb-6 text-[lightgrey]">
                                Save on electricity bills and invest in a more sustainable future with high-quality solar energy systems.
                            </p>
                            <button className="border border-white  hover:bg-[#111827] font-bold py-3 px-6 rounded-lg transition-all">
                                Home solutions
                            </button>
                            {/* <button role="button" class="golden-button">
                            <span className="golden-text">
                            Home
                            </span>
                        </button> */}
                        </div>
                    </div>
                </Carousel>
            </ThemeProvider>
        </div>
    )
}
