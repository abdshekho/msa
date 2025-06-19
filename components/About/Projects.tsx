import Image from 'next/image';
import { IProjects } from '@/app/lib/models/Project';

interface ProjectsProps {
  projects: IProjects[];
  title: string;
  lang: any
}

export default function Projects({ projects, title, lang }: ProjectsProps) {
  return (
    <div className="my-20">
      <h2 className="head-1 mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project: any) => (
          <div key={project._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
            {project.image && (
              <div className="relative w-full h-60 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Description overlay that appears on hover */}
                <div className="absolute inset-0 bg-[#000000b5] bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="font-bold text-white text-center text-sm leading-relaxed">
                    {lang === 'en' ? project.description : project.descriptionAr || project.description}
                  </p>
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="head-22 mb-2 text-center">{lang === 'en' ? project.title : project.titleAr}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}