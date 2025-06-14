import ServicesList from '../../../components/services/ServicesList';
import ServiceHero from '../../../components/services/ServiceHero';
// import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata } from 'next';
import CallToAction from '@/components/Home/CallToAction';
import { FaCheckCircle, FaHandshake, FaHeadset, FaMedal, FaRegCheckCircle, FaTools, FaTrophy } from 'react-icons/fa';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const resolvedParam = await params;
  return {
    title: resolvedParam.lang === 'en' ? 'Services' : 'خدماتنا',
  };
}

export default async function ServicesPage({ params }: { params: { lang: Locale }; }) {
  const resolvedParam = await params;
  const lang = resolvedParam.lang;
  // const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen">
      <ServiceHero lang={ lang } />

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary dark:text-primary-10 mb-4">
          { lang === 'ar' ? 'خدماتنا' : 'Our Services' }
        </h2>
        <p className="text-center text-secondary dark:text-white mb-12 max-w-2xl mx-auto">
          { lang === 'ar'
            ? 'نقدم مجموعة واسعة من خدمات الطاقة الشمسية لتلبية احتياجاتك من الطاقة. فريقنا من الخبراء مكرس لتقديم حلول عالية الجودة مصممة خصيصًا لمتطلباتك المحددة.'
            : 'We offer a wide range of solar power services to meet your energy needs. Our team of experts is dedicated to providing high-quality solutions tailored to your specific requirements.' }
        </p>

        <ServicesList />

        <div className="relative mt-16 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl border-b-4 border-primary p-8 pt-30 shadow-2xl">
          <div className="custom-shape-divider-top-1749812276">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
            </svg>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold mb-20 text-center text-white">
            { lang === 'ar' ? 'لماذا تختار خدماتنا؟' : 'Why Choose Our Services?' }
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-white">
                  <FaTrophy />
                </span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">
                { lang === 'ar' ? 'الخبرة' : 'Expertise' }
              </h4>
              <p className="text-white">
                { lang === 'ar'
                  ? 'يتكون فريقنا من محترفين معتمدين ذوي سنوات من الخبرة في حلول الطاقة الشمسية.'
                  : 'Our team consists of certified professionals with years of experience in solar energy solutions.' }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-white">
                  <FaMedal />
                </span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">
                { lang === 'ar' ? 'الجودة' : 'Quality' }
              </h4>
              <p className="text-white">
                { lang === 'ar'
                  ? 'نستخدم فقط المكونات والمواد عالية الجودة لضمان طول عمر وكفاءة نظام الطاقة الشمسية الخاص بك.'
                  : 'We use only high-quality components and materials to ensure the longevity and efficiency of your solar system.' }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-white">
                  <FaHandshake />
                </span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-white">
                { lang === 'ar' ? 'الدعم' : 'Support' }
              </h4>
              <p className="text-white">
                { lang === 'ar'
                  ? 'نقدم الدعم والصيانة المستمرة لضمان عمل نظام الطاقة الشمسية الخاص بك بأعلى كفاءة.'
                  : 'We provide ongoing support and maintenance to ensure your solar system operates at peak efficiency.' }
              </p>
            </div>
          </div>
          {/* Trust Indicators */ }
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-80 py-6">
            <div className="flex items-center gap-2 text-white">
              <FaRegCheckCircle />
              <span className="text-sm font-medium">
                { lang === 'ar' ? '100% دقة في تنفيذ' : '100% Accurate Implementation' }
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="text-sm font-medium">
                { lang === 'ar' ? 'نتائج فورية' : 'Instant Results' }
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm font-medium">
                { lang === 'ar' ? 'موثوق ومضمون' : 'Trusted & Guaranteed' }
              </span>
            </div>
          </div>
        </div>
      </div>
      <CallToAction lang={lang}/>
    </div>
  );
}