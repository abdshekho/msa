import { FaSolarPanel } from 'react-icons/fa';
import UndrawTeamwork from '@/public/svg/contact2.svg';
export default function ContactHero({lang}) {
    return (
        <div className="relative bg-gradient-to-b md:bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20 px-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
                    <div className="w-full lg:w-1/3 mb-10 md:mb-0 mt-[-150px] md:mt-0">
                        <h1 className="text-2xl md:text-5xl font-bold mb-4">
                            {lang == 'en' ? 
                            'Stay in Touch':
                            'ابقَ على تواصل'
                            }
                            </h1>
                        <p className="text-md md:text-xl mb-8">
                            
                            {lang == 'en' ?
                            'We\'re here to help. Send us a message and we\'ll get back to you soon.':
                            'نحن جاهزون للإجابة عن استفساراتك. راسلنا وسنعود إليك قريبًا.'
                            }
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="bg-[#d28711] hover:bg-yellow-600 text-whitefont-bold py-3 md:py-3 px-4 md:px-6 rounded-lg transition duration-300">
                                Get a Free Quote
                            </button>
                            <button className="bg-transparent hover:bg-white hover:text-teal-800 text-white font-bold py-2 md:py-3 px-4 md:px-6 border-2 border-white rounded-lg transition duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 flex justify-center overflow-hidden ">
                        <div >
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