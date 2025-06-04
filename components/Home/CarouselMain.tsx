import React from 'react'
import { Carousel, createTheme, ThemeProvider } from "flowbite-react";
import Image from "next/image";

export default function CarouselMain({ lang }) {
    const mainTheme = {
        "root": {
            "base": "relative h-full w-full",
            "leftControl": "absolute left-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
            "rightControl": "absolute right-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none"
        },
        "indicators": {
            "active": {
                "off": "bg-secondary hover:bg-secondary dark:bg-secondary-10 dark:hover:bg-secondary",
                "on": "bg-primary dark:bg-primary"
            },
            "base": "h-3 w-3 rounded-full",
            "wrapper": "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3 z-2"
        },
        "item": {
            "base": "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2",
            "wrapper": {
                "off": "w-full shrink-0 transform cursor-default snap-center",
                "on": "w-full shrink-0 transform cursor-grab snap-center"
            }
        },
        "control": {
            "base": "inline-flex h-8 w-8 items-center justify-center bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70",
            "icon": "h-5 w-5 text-white sm:h-6 sm:w-6 dark:text-white"
        },
        "scrollContainer": {
            "base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-hidden  scroll-smooth",
            "snap": "snap-x"
        }
    };
    return (
        <div className="relative h-[40vh] lg:h-[calc(100vh-66px)]">
            <div className="custom-shape-divider-bottom-1749044904">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="shape-fill"></path>
                </svg>
            </div>
            <Carousel slide={ false } className='relative overflow-x-hidden' theme={ mainTheme } style={ { direction: 'ltr' } }>
                <div className="relative flex h-full items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-900 dark:to-blue-800">
                    <img
                        // src='/en/carousel/technical.webp'
                        // src='/en/carousel/technical.png'
                        src='/en/carousel/technicalm.webp'
                        alt="الطاقة الشمسية للمنازل"
                        // className="object-fill opacity-60 h-full md:h-auto w-full"
                        className=" h-full w-full"
                    />
                    <div className="absolute inset-0 r bg-gradient-to-b from-black from-30%  via-[#00000017] via-60% to-black opacity-70"></div>
                    <div className="absolute left-0 z-10 text-center text-white px-4 md:px-12 max-w-2xl top-[90px]">
                        <h2 className="text-xl lg:text-5xl font-bold mb-0 md:mb-4 text-[lightblue]">
                            { lang === 'en' ? "Free Consultation" : "استشارة مجانية مع خبرائنا" }
                        </h2>
                        {/* <p className="text-md lg:text-xl mb-6 text-[lightgoldenrodyellow]"> */ }
                        <p className="text-sm lg:text-xl mb-2 md:mb-6 text-white ">
                            { lang === 'en' ?
                                'Get free consultations and expert solutions to choose the best system for your needs.'
                                :
                                'احصل على استشارات وحلول مجانية من خبرائنا لمساعدتك في اختيار النظام الأنسب.'
                            }
                        </p>
                        <div className='flex justify-center gap-2'>
                            <button className="bg-primary  hover:bg-primary-10   text-white md:font-bold py-1.5 px-3 md:py-3 md:px-6 rounded-lg transition-all">
                                { lang === 'en' ? "Services" : "خدماتنا" }
                            </button>
                            <button className="border border-white  hover:bg-[#053862] md:font-bold text-sm md:text-base py-1.5 px-3 md:py-3 md:px-6 rounded-lg transition-all">
                                { lang === 'en' ? "Contact us" : "تواصل معنا" }
                            </button>
                        </div>
                    </div>

                </div>
                <div className="relative flex h-full items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-900 dark:to-blue-800">
                    <img
                        // src='/en/carousel/technical.webp'
                        // src='/en/carousel/technical.png'
                        src='/en/carousel/handshake.jpg'
                        alt="الطاقة الشمسية للمنازل"
                        // className="object-fill opacity-60 h-full md:h-auto w-full"
                        className=" h-full w-full"
                    />
                    <div className="absolute inset-0 r bg-gradient-to-b from-black from-30%  via-[#00000017] via-60% to-black opacity-40 blur-3xl"></div>
                    <div className="absolute z-10 text-center text-white px-4 md:px-12 max-w-3xl top-[50px]">
                        <h2 className="text-xl lg:text-5xl font-bold mb-4 text-[lightblue]">
                            {/* {lang === 'en'? "" : "" } */ }
                            { lang === 'en' ? "Our Partners" : "شركاؤنا" }
                        </h2>
                        {/* <p className="text-md lg:text-xl mb-6 text-[lightgoldenrodyellow]"> */ }
                        <p className="text-md lg:text-xl mb-6 text-white ">
                            { lang === 'en' ?
                                'We partner with leading global companies to bring you the latest and most reliable energy products — guaranteed quality and performance.'
                                :
                                'نتعاون مع كبرى الشركات العالمية لتوفير أحدث وأفضل منتجات الطاقة بكفاءة وجودة مضمونة'
                            }
                        </p>
                        <div className='flex justify-center gap-2'>
                            <button className="bg-primary  hover:bg-primary-10 text-white font-bold py-3 px-6 rounded-lg transition-all">
                                { lang === 'en' ? "Brands" : "العلامات التجارية" }
                            </button>
                            <button className="border border-white  hover:bg-[#053862] font-bold py-3 px-6 rounded-lg transition-all">
                                { lang === 'en' ? "Our Partners" : "شركاؤنا" }
                            </button>
                        </div>
                    </div>
                </div>
                <div className="relative flex h-full items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-900 dark:to-blue-800">
                    <img
                        // src='/en/carousel/technical.webp'
                        // src='/en/carousel/technical.png'
                        src='/en/carousel/technical.jpeg'
                        alt="الطاقة الشمسية للمنازل"
                        // className="object-fill opacity-60 h-full md:h-auto w-full"
                        className=" h-full w-full"
                    />
                    <div className="absolute inset-0 r bg-gradient-to-b from-black from-30%  via-[#00000017] via-60% to-black opacity-40"></div>
                    <div className="absolute z-10 text-center text-white px-4 md:px-12 max-w-3xl top-[70px]">
                        <h2 className="text-xl lg:text-5xl font-bold mb-4 text-[lightblue]">
                            {/* {lang === 'en'? "" : "" } */ }
                            { lang === 'en' ? "We provide" : "نقدم لكم" }
                        </h2>
                        {/* <p className="text-md lg:text-xl mb-6 text-[lightgoldenrodyellow]"> */ }
                        <p className="text-md lg:text-xl mb-6 text-white ">
                            { lang === 'en' ?
                                'installation, maintenance, and shipping services for all our products across all regions — fast and professionally.'
                                :
                                'خدمات تركيب، صيانة، وشحن لجميع منتجاتنا إلى كافة المناطق بسرعة واحترافية.'
                            }
                        </p>
                        <div className='flex justify-center gap-2'>
                            <button className="bg-primary  hover:bg-primary-10 text-white font-bold py-3 px-6 rounded-lg transition-all">
                                { lang === 'en' ? "Discover our products" : "تصفح منتجاتنا" }
                            </button>
                            <button className="border border-white  hover:bg-[#053862] font-bold py-3 px-6 rounded-lg transition-all">
                                { lang === 'en' ? "Contact us" : "تواصل معنا" }
                            </button>
                        </div>
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
            <div className="custom-shape-divider-top-1747581643">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
        </div>
    )
}
