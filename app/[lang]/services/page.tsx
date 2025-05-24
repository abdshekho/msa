import ServicesList from '../../../components/services/ServicesList';
import ServiceHero from '../../../components/services/ServiceHero';

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServiceHero />
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary dark:text-primary-10 mb-4">Our Services</h2>
        <p className="text-center text-secondary dark:text-secondary-10 mb-12 max-w-2xl mx-auto">
          We offer a wide range of solar power services to meet your energy needs. Our team of experts is dedicated to providing high-quality solutions tailored to your specific requirements.
        </p>
        
        <ServicesList />
        
        <div className="mt-16 bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-center text-primary dark:text-primary-10">Why Choose Our Services?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-secondary dark:text-secondary-10">Expertise</h4>
              <p className="text-gray-600 dark:text-gray-300">Our team consists of certified professionals with years of experience in solar energy solutions.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-secondary dark:text-secondary-10">Quality</h4>
              <p className="text-gray-600 dark:text-gray-300">We use only high-quality components and materials to ensure the longevity and efficiency of your solar system.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-secondary dark:text-secondary-10">Support</h4>
              <p className="text-gray-600 dark:text-gray-300">We provide ongoing support and maintenance to ensure your solar system operates at peak efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}