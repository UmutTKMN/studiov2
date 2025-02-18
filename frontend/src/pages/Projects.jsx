import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Tüm Projeler' },
    { id: 'web', name: 'Web Projeleri' },
    { id: 'mobile', name: 'Mobil Uygulamalar' },
    { id: 'design', name: 'UI/UX Tasarımlar' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-Ticaret Platformu',
      description: 'Modern ve ölçeklenebilir e-ticaret çözümü',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878',
      technologies: ['React', 'Node.js', 'MongoDB'],
      client: 'TechStore',
      year: '2024'
    },
    // Diğer projeler...
  ];

  const filteredProjects = selectedFilter === 'all'
    ? projects
    : projects.filter(project => project.category === selectedFilter);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Projelerimiz
          </h1>
          <p className="text-lg text-gray-600">
            Başarıyla tamamladığımız projelerden örnekler
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                ${selectedFilter === filter.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          layout
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`project-${project.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Link to={`/projects/${project.id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <p className="text-sm opacity-90">{project.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{project.client}</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
