import Image from 'next/image';
import { getDictionary } from '../../../get-dictionary';
import AboutHero from '@/components/About/AboutHero';
import { FaLightbulb, FaMedal, FaRecycle, FaRocket, FaSolarPanel } from 'react-icons/fa';

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const resolveParams = await params;
  const dict = await getDictionary(resolveParams.lang);
  const isArabic = resolveParams.lang === 'ar';

  return (
    <div className="bg-white dark:bg-gray-900">
      <AboutHero lang={resolveParams.lang}/>
      {/* Header */ }
      {/* <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {dict.page.about.title}
          </h1>
          <p className="text-center mt-4 max-w-2xl mx-auto">
            {dict.page.about.description}
          </p>
        </div>
      </div> */}

      {/* Company Overview */ }
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 mb-16 md:tracking-[1px] md:leading-[2.5] max-w-7xl mx-auto">
          <div className="md:w-1/2">
            <h2 className="head-1 mb-4">
              { dict.page.about.who.title }
            </h2>
            <p className="desc mb-4 whitespace-pre-line">
              { dict.page.about.who.p1 }
            </p>
            <p className="desc whitespace-pre-line">
              { dict.page.about.who.p2 }
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/en/company.jpg"
              alt={ isArabic ? "صورة الشركة" : "Company Image" }
              width={ 600 }
              height={ 400 }
              className="rounded-lg shadow-md object-contain"
            />
          </div>
        </div>

        {/* Our Mission */ }
        <div className="flex flex-col md:flex-row-reverse gap-8 mb-16 md:tracking-[1px] md:leading-[3]  max-w-7xl mx-auto">
          <div className="md:w-1/2">
            <h2 className="head-1 mb-4">
              { dict.page.about.mission.title }
            </h2>
            <p className="desc mb-4 whitespace-pre-line">
              { dict.page.about.mission.p1 }
            </p>
            <p className="desc whitespace-pre-line">
              { dict.page.about.mission.p2 }
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/en/company.jpg"
              alt={ isArabic ? "مهمتنا" : "Our Mission" }
              width={ 600 }
              height={ 400 }
              className="rounded-lg shadow-md object-contain"
            />
          </div>
        </div>

        {/* Our Values */ }
        <div className="my-30 text-center">
          <h2 className="head-1 mb-8 text-center">
            { dict.page.about.values.title }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between items-center text-center">
                <FaRocket className="w-10 h-10 text-[#e91e63]" />
              <h3 className="head-22 mb-3">
                { dict.page.about.values.innovation.title }
              </h3>
              <p className="desc">
                { dict.page.about.values.innovation.description }
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between items-center text-center">
              <FaRecycle className="w-10 h-10 text-blue-500" />
              <h3 className="head-22 mb-3">
                { dict.page.about.values.sustainability.title }
              </h3>
              <p className="desc">
                { dict.page.about.values.sustainability.description }
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between items-center text-center">
              <FaMedal className="w-10 h-10 text-green-800" />
              <h3 className="head-22 mb-3">
                { dict.page.about.values.excellence.title }
              </h3>
              <p className="desc">
                { dict.page.about.values.excellence.description }
              </p>
            </div>
          </div>
        </div>

        {/* Our Team */ }
        <div className='my-20'>
          <h2 className="head-1 mb-8 text-center">
            { dict.page.about.team.title }
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            { [1, 2, 3, 4].map((i) => (
              <div key={ i } className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image
                    // src={ `/en/team-member-${i}.jpg` }
                    src={ `/en/profile.webp` }
                    alt={ `${dict.page.about.team.member} ${i}` }
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="head-22 mb-1">
                  { isArabic ? `اسم الشخص ${i}` : `Person Name ${i}` }
                </h3>
                <p className="text-primary dark:text-primary-10 font-medium">
                  { isArabic ? `المنصب ${i}` : `Position ${i}` }
                </p>
              </div>
            )) }
          </div>
        </div>
      </div>
    </div>
  );
}