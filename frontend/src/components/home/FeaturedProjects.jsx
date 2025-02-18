import React from 'react';
import { motion } from 'framer-motion';

export default function FeaturedProjects() {
  const projects = [
    {
      title: 'E-Ticaret Platformu',
      description: 'Modern ve kullanıcı dostu e-ticaret çözümü',
      image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3',
      tech: ['React', 'Node.js', 'MongoDB'],
      link: '/projects/e-commerce'
    },
    {
      title: 'Mobil Uygulama',
      description: 'iOS ve Android için geliştirilmiş mobil uygulama',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3',
      tech: ['React Native', 'Firebase'],
      link: '/projects/mobile-app'
    },
    {
      title: 'Web Portal',
      description: 'Kurumsal web portal ve yönetim sistemi',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
      tech: ['Vue.js', 'Laravel', 'PostgreSQL'],
      link: '/projects/web-portal'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Öne Çıkan Projelerimiz
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Son dönemde tamamladığımız bazı projelerimiz
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
            >
              <div className="relative">
                <img className="h-48 w-full object-cover" src={project.image} alt={project.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                <p className="mt-2 text-base text-gray-500">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
                >
                  Detayları Gör
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
