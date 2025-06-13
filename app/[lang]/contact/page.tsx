import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getDictionary } from '../../../get-dictionary';
import ContactForm from './ContactForm';
import ContactHero from '@/components/contact/ContactHero';
import { Metadata } from 'next';
import { Locale } from '@/i18n-config';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const resolvedParam = await params;
  return {
    title: resolvedParam.lang === 'en' ? 'Contact us' : 'تواصل معنا',
  };
}

export default async function ContactPage({ params }: { params: { lang: Locale } }) {
  const resolvedparams = await params;
  const lang = resolvedparams.lang
  const dict = await getDictionary(lang);

  return (
    <div className="bg-white dark:bg-gray-900">
      <ContactHero lang={lang}/>
      {/* Header */ }
      {/* <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {dict.page.contact.title}
          </h1>
          <p className="text-center mt-4 max-w-2xl mx-auto">
            {dict.page.contact.description}
          </p>
        </div>
      </div> */}

      {/* Contact Information */ }
      <div className="container mx-auto px-4 py-12">
        <div>
          <h2 className="text-3xl font-bold text-center text-primary dark:text-primary-10 mb-4">
            { lang === 'ar' ? 'خدماتنا' : 'Contact Us' }
          </h2>
          <p className="text-center text-secondary dark:text-white mb-12 max-w-2xl mx-auto">
            { lang === 'ar'
              ? `نحن هنا للإجابة عن جميع استفساراتك وتقديم الدعم الذي تحتاجه.
              سواء كنت تبحث عن معلومات إضافية حول خدماتنا، أو ترغب في تقديم ملاحظات، لا تتردد في التواصل معنا عبر النموذج أدناه أو من خلال وسائل الاتصال المتاحة.
              فريقنا سيقوم بالرد عليك في أقرب وقت ممكن.`
              : `We’re here to answer all your questions and provide the support you need.
            Whether you're looking for more information about our services or would like to give feedback, feel free to reach out to us through the form below or via the available contact methods.
            Our team will get back to you as soon as possible.` }
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="border-b-4 border-teal-700 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center space-y-3">
            <div className="bg-teal-700 text-white p-4 rounded-full shadow-3xl">
              <FaPhone className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              { dict.page.contact.info.call }
            </h3>
            <div className="space-y-1">
              <p className="text-gray-700 dark:text-gray-300 font-medium">+963 123 456 789</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">+963 987 654 321</p>
            </div>
          </div>

          <div className="border-b-4 border-teal-700 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center space-y-3">
            <div className="bg-teal-700 text-white p-4 rounded-full shadow-3xl">
              <FaEnvelope className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              { dict.page.contact.info.email }
            </h3>
            <p className="text-gray-600 dark:text-gray-300">info@example.com</p>
            <p className="text-gray-600 dark:text-gray-300">support@example.com</p>
          </div>

          <div className="border-b-4 border-teal-700 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center space-y-3">
            <div className="bg-teal-700 text-white p-4 rounded-full shadow-3xl">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              { dict.page.contact.info.location }
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              { dict.page.contact.info.address }
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              { dict.page.contact.info.street }
            </p>
          </div>
        </div>

        {/* Contact Form */ }
        <ContactForm dict={ dict.page.contact } lang={ lang } />
      </div>

      {/* Map */ }
      <div id='our-location' className="w-full h-96 mt-12 container mx-auto rounded-2xl border-b-6 border-teal-700 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d26619.66752714984!2d36.2256376!3d33.4894478!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518de1e9b0110e9%3A0x6841a070df887531!2sAl%20Mazzeh%2C%20Damascus%2C%20Syria!5e0!3m2!1sen!2s!4v1749358097576!5m2!1sen!2s%22%20width=%22600%22%20height=%22450%22%20style=%22border:0;%22%20allowfullscreen=%22%22%20loading=%22lazy%22%20referrerpolicy=%22no-referrer-when-downgrade"
          width="100%"
          height="100%"
          style={ { border: 0,borderRadius:"16px"} }
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}