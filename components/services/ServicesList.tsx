'use client';

import { FaSolarPanel, FaTools, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { MdElectricalServices, MdEngineering } from 'react-icons/md';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import { GiSolarPower } from 'react-icons/gi';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

export default function ServicesList() {
  const services: Service[] = [
    {
      id: 1,
      title: 'Solar Panel Installation',
      description: 'Professional installation of high-efficiency solar panels for residential and commercial properties.',
      icon: <FaSolarPanel className="w-10 h-10 text-yellow-500" />
    },
    {
      id: 2,
      title: 'Maintenance & Repair',
      description: 'Regular maintenance and prompt repair services to ensure your solar system operates at peak efficiency.',
      icon: <FaTools className="w-10 h-10 text-blue-500" />
    },
    {
      id: 3,
      title: 'Energy Consultation',
      description: 'Expert advice on energy consumption patterns and recommendations for optimal solar solutions.',
      icon: <FaChartLine className="w-10 h-10 text-green-500" />
    },
    {
      id: 4,
      title: 'System Design',
      description: 'Custom solar system designs tailored to your specific energy needs and property characteristics.',
      icon: <MdEngineering className="w-10 h-10 text-purple-500" />
    },
    {
      id: 5,
      title: 'Electrical Services',
      description: 'Comprehensive electrical services including wiring, inverter installation, and grid connection.',
      icon: <MdElectricalServices className="w-10 h-10 text-red-500" />
    },
    {
      id: 6,
      title: 'Energy Efficiency Solutions',
      description: 'Innovative solutions to improve your overall energy efficiency and reduce consumption.',
      icon: <FaLightbulb className="w-10 h-10 text-amber-500" />
    },
    {
      id: 7,
      title: 'Battery Storage Systems',
      description: 'Installation of advanced battery storage systems to maximize your solar energy utilization.',
      icon: <BsFillLightningChargeFill className="w-10 h-10 text-blue-600" />
    },
    {
      id: 8,
      title: 'Solar Power Monitoring',
      description: 'Real-time monitoring systems to track your solar power generation and energy consumption.',
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
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}