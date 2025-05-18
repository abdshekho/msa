import ServicesList from '../../../components/services/ServicesList';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        We offer a wide range of services to meet your needs. Our team of experts is dedicated to providing high-quality solutions tailored to your specific requirements.
      </p>
      
      <ServicesList />
    </div>
  );
}