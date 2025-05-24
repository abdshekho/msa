import Image from "next/image";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter, BsLinkedin } from "react-icons/bs";
export function FooterMSA() {
    return (
        <footer className="bg-card-10 dark:bg-card">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="/" className="flex items-center">
                            <Image src="/favicon.ico" width={ 90 } height={ 90 } alt="FlowBite Logo" />
                            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">MSA sunpower</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-bold text-primary  uppercase ">Resources</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="/" className="hover:underline text-secondary dark:text-secondary-10">Flowbite</a>
                                </li>
                                <li>
                                    <a href="https://tailwindcss.com/" className="hover:underline text-secondary dark:text-secondary-10">Tailwind CSS</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-bold uppercase text-primary">Follow us</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="https://github.com/themesberg/flowbite" className="hover:underline text-secondary dark:text-secondary-10">Github</a>
                                </li>
                                <li>
                                    <a href="https://discord.gg/4eeurUVvTy" className="hover:underline text-secondary dark:text-secondary-10">Discord</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-bold uppercase text-primary">Legal</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="#" className="hover:underline text-secondary dark:text-secondary-10">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:underline text-secondary dark:text-secondary-10">Terms &amp; Conditions</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025<a href="/" className="hover:underline">Code pro™</a>. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <BsFacebook />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsLinkedin />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <BsTwitter />
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <span className="sr-only">Dribbble account</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    );
}
