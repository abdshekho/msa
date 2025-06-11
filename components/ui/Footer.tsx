import Image from "next/image";
import logo from '@/public/FINAL.png'
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter, BsLinkedin, BsWhatsapp, BsYoutube } from "react-icons/bs";
import Link from "next/link";
export function FooterMSA({ lang, dictionary }) {
    return (
        <footer dir="ltr" className="bg-gradient-to-t md:bg-gradient-to-t from-card-10 to-[#b1980b2d]
            dark:from-card dark:to-[#d2881127] relative pt-[50px] md:pt-[100px] mt-40">
            {/* <footer dir="ltr" className="bg-gradient-to-t md:bg-gradient-to-l from-card-10 to-[#b1980b2d]
            dark:from-card dark:to-[#d2881134] relative pt-[50px] md:pt-[100px] mt-40"> */}
            <div className="custom-shape-divider-top-55555555555">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="/" className="flex items-center justify-center">
                            <Image src={ logo } width={ 140 } height={ 140 } alt="FlowBite Logo" />
                            {/* <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">MSA sunpower</span> */ }
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4 my-8 md:my-0 text-center">
                        <div>
                            <h2 className="mb-6  text-sm font-bold text-primary  uppercase ">{dictionary.footer.Services}</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm ">
                                <li className="mb-4">
                                    <Link href={`/${lang}/solar-calculator`} className="hover:underline text-secondary dark:text-secondary-10">{dictionary.footer.System_Calculator}</Link>
                                </li>
                                <li>
                                    <Link href={ `/${lang}/services` } className="hover:underline text-secondary dark:text-secondary-10">{dictionary.footer.Our_services}</Link>
                                </li>

                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6  text-sm font-bold text-primary  uppercase ">{dictionary.footer.Resources}</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm ">
                                <li className="mb-4">
                                    <Link href={ `/${lang}/about` } className="hover:underline text-secondary dark:text-secondary-10">{dictionary.footer.about}</Link>
                                </li>
                                <li>
                                    <Link href={ `/${lang}/contact#our-location` } className="hover:underline text-secondary dark:text-secondary-10">{dictionary.footer.Our_Location}</Link>
                                </li>

                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-bold uppercase text-primary">{dictionary.footer.Follow_us}</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm">
                                <li className="mb-4">
                                    <a target="_blank" href="#" className="hover:underline text-secondary dark:text-secondary-10">LinkedIn</a>
                                </li>
                                <li>
                                    <a target="_blank" href="#" className="hover:underline text-secondary dark:text-secondary-10">Facebook</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-bold uppercase text-primary">{dictionary.footer.Legal}</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium text-xs md:text-sm">
                                <li className="mb-4">
                                    <Link href={ `/${lang}/privacy` } className="hover:underline text-secondary dark:text-secondary-10">{dictionary.footer.privacy}</Link>
                                </li>
                                <li>
                                    <Link href={ `/${lang}/terms` } className="hover:underline text-secondary dark:text-secondary-10">{dictionary.footer.terms}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="flex gap-3 flex-col-reverse md:flex-row md:items-center justify-center md:justify-between">
                    <div className="text-sm text-gray-500 text-center dark:text-gray-400">© 2025<Link href="#" className="hover:underline hover:text-primary"> MSA sunPower™ </Link> . All Rights Reserved.
                    </div>
                    <div className="flex mt-4 justify-center sm:mt-0 gap-1 text-xl">
                        <a href="#" className="text-[#3b5998] hover:text-gray-900 dark:hover:text-white">
                            <BsFacebook/>
                        </a>
                        <a href="#" className="text-[#0a66c2] hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsLinkedin />
                        </a>
                        <a href="#" className="text-[#0084b4] hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsTwitter />
                        </a>
                        <a href="#" className="text-[#25D366] hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsWhatsapp />
                        </a>
                        <a href="#" className="text-[#C32AA3] hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsInstagram />
                        </a>
                        <a href="#" className="text-[#FF0000] hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsYoutube />
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    );
}
