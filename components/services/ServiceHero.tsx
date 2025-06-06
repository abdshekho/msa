import { FaSolarPanel } from 'react-icons/fa';
import UndrawTeamwork from '@/public/svg/undraw_product-iteration_r2wg.svg';
import { useParams } from 'next/navigation';

export default function ServiceHero({lang}) {
    
    return (
        <div className="relative bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4" style={{direction:'ltr'}}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
                    <div className="w-full lg:w-1/3 mb-10 md:mb-0 mt-[-200px] md:mt-0" style={{direction:lang === 'en' ?"ltr":"rtl"}}>
                        <h1 className="text-2xl md:text-5xl font-bold mb-4">
                            {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
                        </h1>
                        <p className="text-md md:text-xl mb-8">
                            {lang === 'ar' 
                                ? 'استفد من قوة الشمس مع حلول الطاقة الشمسية الشاملة لدينا. نقدم خدمات متكاملة من الاستشارة إلى التركيب والصيانة.'
                                : 'Harness the power of the sun with our comprehensive solar energy solutions. We provide end-to-end services from consultation to installation and maintenance.'}
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="bg-[#d28711] hover:bg-yellow-600 text-whitefont-bold py-3 md:py-3 px-4 md:px-6 rounded-lg transition duration-300">
                                {lang === 'ar' ? 'احصل على عرض سعر مجاني' : 'Get a Free Quote'}
                            </button>
                            <button className="bg-transparent hover:bg-white hover:text-blue-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 border-2 border-white rounded-lg transition duration-300">
                                {lang === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 flex justify-center overflow-hidden ">
                        <div>
                            <UndrawTeamwork className="md:w-[800px] md:h-[600px] overflow-hidden scale-[0.4] scale-50 lg:scale-75" />
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