'use client';

import { FaSolarPanel, FaTools, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { MdElectricalServices, MdEngineering } from 'react-icons/md';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import { GiSolarPower } from 'react-icons/gi';
import { useParams } from 'next/navigation';

interface Service {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: JSX.Element;
}

export default function ServicesList() {
  const params = useParams();
  const lang = params.lang as string;

  const services: Service[] = [
    {
      id: 1,
      title: 'Solar Panel Installation',
      titleAr: 'تركيب ألواح الطاقة الشمسية',
      description: 'Professional installation of high-efficiency solar panels for residential and commercial properties.',
      descriptionAr: 'تركيب احترافي لألواح الطاقة الشمسية عالية الكفاءة للمباني السكنية والتجارية.',
      icon: <FaSolarPanel className="w-10 h-10 text-yellow-500" />
    },
    {
      id: 2,
      title: 'Maintenance & Repair',
      titleAr: 'الصيانة والإصلاح',
      description: 'Regular maintenance and prompt repair services to ensure your solar system operates at peak efficiency.',
      descriptionAr: 'خدمات الصيانة الدورية والإصلاح السريع لضمان عمل نظام الطاقة الشمسية بأعلى كفاءة.',
      icon: <FaTools className="w-10 h-10 text-blue-500" />
    },
    {
      id: 3,
      title: 'Energy Consultation',
      titleAr: 'استشارات الطاقة',
      description: 'Expert advice on energy consumption patterns and recommendations for optimal solar solutions.',
      descriptionAr: 'نصائح خبراء حول أنماط استهلاك الطاقة وتوصيات للحلول الشمسية المثلى.',
      icon: <FaChartLine className="w-10 h-10 text-green-500" />
    },
    {
      id: 4,
      title: 'System Design',
      titleAr: 'تصميم الأنظمة',
      description: 'Custom solar system designs tailored to your specific energy needs and property characteristics.',
      descriptionAr: 'تصميمات مخصصة لأنظمة الطاقة الشمسية تناسب احتياجاتك الخاصة وخصائص العقار.',
      icon: <MdEngineering className="w-10 h-10 text-purple-500" />
    },
    {
      id: 5,
      title: 'Electrical Services',
      titleAr: 'الخدمات الكهربائية',
      description: 'Comprehensive electrical services including wiring, inverter installation, and grid connection.',
      descriptionAr: 'خدمات كهربائية شاملة تشمل التوصيلات، وتركيب العاكس، والاتصال بالشبكة.',
      icon: <MdElectricalServices className="w-10 h-10 text-red-500" />
    },
    {
      id: 6,
      title: 'Energy Efficiency Solutions',
      titleAr: 'حلول كفاءة الطاقة',
      description: 'Innovative solutions to improve your overall energy efficiency and reduce consumption.',
      descriptionAr: 'حلول مبتكرة لتحسين كفاءة الطاقة الإجمالية وتقليل الاستهلاك.',
      icon: <FaLightbulb className="w-10 h-10 text-amber-500" />
    },
    {
      id: 7,
      title: 'Battery Storage Systems',
      titleAr: 'أنظمة تخزين البطاريات',
      description: 'Installation of advanced battery storage systems to maximize your solar energy utilization.',
      descriptionAr: 'تركيب أنظمة تخزين البطاريات المتقدمة لتعظيم استخدام الطاقة الشمسية.',
      icon: <BsFillLightningChargeFill className="w-10 h-10 text-blue-600" />
    },
    {
      id: 8,
      title: 'Solar Power Monitoring',
      titleAr: 'مراقبة الطاقة الشمسية',
      description: 'Real-time monitoring systems to track your solar power generation and energy consumption.',
      descriptionAr: 'أنظمة مراقبة في الوقت الفعلي لتتبع إنتاج الطاقة الشمسية واستهلاك الطاقة.',
      icon: <GiSolarPower className="w-10 h-10 text-yellow-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold text-secondary dark:text-secondary-10 mb-2">
              {lang === 'ar' ? service.titleAr : service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {lang === 'ar' ? service.descriptionAr : service.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}