import { FaSolarPanel } from 'react-icons/fa';
import UndrawTeamwork from '@/public/svg/categories.svg';

export default function CategoriesHero({ lang }) {
    return (
        <div className="relative bg-gradient-to-t md:bg-gradient-to-r from-sky-900 to-sky-300 text-white py-20 px-4" style={{direction: "ltr"}}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
                    <div className="w-full lg:w-1/3 mb-10 md:mb-0 mt-[-150px] md:mt-0" style={{direction: lang === 'en' ? "ltr" : "rtl"}}>
                        <h1 className="text-2xl md:text-5xl font-bold mb-4">
                            {lang === 'en' ? 'Explore Our Product Categories' : 'استكشف فئات منتجاتنا'}
                        </h1>
                        <p className="text-md md:text-xl mb-8">
                            {lang === 'en' 
                                ? 'Discover a wide range of product categories tailored to meet your every need. From solar panels and inverters to batteries and accessories, we bring you the best solutions from trusted global brands.'
                                : 'اكتشف مجموعة واسعة من فئات المنتجات المصممة لتلبية جميع احتياجاتك. من الألواح الشمسية والمحولات إلى البطاريات والملحقات، نقدم لك أفضل الحلول من العلامات التجارية العالمية الموثوقة.'
                            }
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="bg-[#d28711] hover:bg-yellow-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg transition duration-300">
                                {lang === 'en' ? 'Get a Free Quote' : 'احصل على عرض سعر مجاني'}
                            </button>
                            <button className="bg-transparent hover:bg-white hover:text-sky-900 text-white font-bold py-2 md:py-3 px-4 md:px-6 border-2 border-white rounded-lg transition duration-300">
                                {lang === 'en' ? 'Learn More' : 'اعرف المزيد'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 flex justify-center overflow-hidden">
                        <div>
                            <UndrawTeamwork className="md:w-[900px] md:h-[600px] overflow-hidden scale-[0.4] scale-50 lg:scale-75" />
                        </div>
                    </div>
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