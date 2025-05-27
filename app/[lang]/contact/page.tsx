import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getDictionary } from '../../../get-dictionary';
import ContactForm from './ContactForm';
import ContactHero from '@/components/contact/ContactHero';


export default async function ContactPage({ params }: { params: { lang: string } }) {
  const resolvedparams = await params;
  const lang = resolvedparams.lang
  const dict = await getDictionary(lang);

  return (
    <div className="bg-white dark:bg-gray-900">
      <ContactHero />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary text-white p-3 rounded-full mb-4">
              <FaPhone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              { dict.page.contact.info.call }
            </h3>
            <p className="text-gray-600 dark:text-gray-300">+962 123 456 789</p>
            <p className="text-gray-600 dark:text-gray-300">+962 987 654 321</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary text-white p-3 rounded-full mb-4">
              <FaEnvelope className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              { dict.page.contact.info.email }
            </h3>
            <p className="text-gray-600 dark:text-gray-300">info@example.com</p>
            <p className="text-gray-600 dark:text-gray-300">support@example.com</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="bg-primary text-white p-3 rounded-full mb-4">
              <FaMapMarkerAlt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
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
      <div className="w-full h-96 mt-12">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108711.55279614888!2d35.8637!3d31.9454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b5fb85d7981af%3A0x631c30c0f8dc65e8!2sAmman!5e0!3m2!1sen!2sjo!4v1650000000000!5m2!1sen!2sjo"
          width="100%"
          height="100%"
          style={ { border: 0 } }
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}