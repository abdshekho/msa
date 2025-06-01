import ServicesList from '../../../components/services/ServicesList';
import ServiceHero from '../../../components/services/ServiceHero';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function ServicesPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  
  return (
    <div className="min-h-screen">
      <ServiceHero lang={lang}/>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary dark:text-primary-10 mb-4">
          {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
        </h2>
        <p className="text-center text-secondary dark:text-white mb-12 max-w-2xl mx-auto">
          {lang === 'ar' 
            ? 'نقدم مجموعة واسعة من خدمات الطاقة الشمسية لتلبية احتياجاتك من الطاقة. فريقنا من الخبراء مكرس لتقديم حلول عالية الجودة مصممة خصيصًا لمتطلباتك المحددة.'
            : 'We offer a wide range of solar power services to meet your energy needs. Our team of experts is dedicated to providing high-quality solutions tailored to your specific requirements.'}
        </p>
        
        <ServicesList />
        
        <div className="mt-16 bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-center text-primary dark:text-primary-10">
            {lang === 'ar' ? 'لماذا تختار خدماتنا؟' : 'Why Choose Our Services?'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-secondary dark:text-secondary-10">
                {lang === 'ar' ? 'الخبرة' : 'Expertise'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {lang === 'ar' 
                  ? 'يتكون فريقنا من محترفين معتمدين ذوي سنوات من الخبرة في حلول الطاقة الشمسية.'
                  : 'Our team consists of certified professionals with years of experience in solar energy solutions.'}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-secondary dark:text-secondary-10">
                {lang === 'ar' ? 'الجودة' : 'Quality'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {lang === 'ar' 
                  ? 'نستخدم فقط المكونات والمواد عالية الجودة لضمان طول عمر وكفاءة نظام الطاقة الشمسية الخاص بك.'
                  : 'We use only high-quality components and materials to ensure the longevity and efficiency of your solar system.'}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-secondary dark:text-secondary-10">
                {lang === 'ar' ? 'الدعم' : 'Support'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {lang === 'ar' 
                  ? 'نقدم الدعم والصيانة المستمرة لضمان عمل نظام الطاقة الشمسية الخاص بك بأعلى كفاءة.'
                  : 'We provide ongoing support and maintenance to ensure your solar system operates at peak efficiency.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}