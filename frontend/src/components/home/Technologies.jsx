import React from 'react';
import { motion } from 'framer-motion';

export default function Technologies() {
  const techs = [
    { 
      name: 'React', 
      icon: '/icons/react.svg',
      description: 'Modern web uygulamaları',
      color: 'bg-blue-500'
    },
    { 
      name: 'Vue.js', 
      icon: '/icons/vue.svg',
      description: 'Dinamik kullanıcı arayüzleri',
      color: 'bg-green-500'
    },
    { 
      name: 'Node.js', 
      icon: '/icons/nodejs.svg',
      description: 'Güçlü backend çözümleri',
      color: 'bg-green-600'
    },
    { 
      name: 'Laravel', 
      icon: '/icons/laravel.svg',
      description: 'PHP framework çözümleri',
      color: 'bg-red-500'
    },
    { 
      name: 'React Native', 
      icon: '/icons/react-native.svg',
      description: 'Cross-platform mobil uygulamalar',
      color: 'bg-blue-600'
    },
    { 
      name: 'TypeScript', 
      icon: '/icons/typescript.svg',
      description: 'Tip güvenli JavaScript',
      color: 'bg-blue-700'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            Kullandığımız Teknolojiler
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Modern ve güvenilir teknolojilerle çalışıyoruz
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {techs.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex flex-col items-center p-6 rounded-xl bg-white shadow-lg transform transition duration-500 hover:scale-105">
                <div className={`p-3 rounded-lg ${tech.color} bg-opacity-10`}>
                  <img src={tech.icon} alt={tech.name} className="w-12 h-12" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">{tech.name}</h3>
                <p className="mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
