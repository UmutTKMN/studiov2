import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Animasyonlar için framer-motion ekleyelim

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto pt-16 pb-20 px-4 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="relative max-w-lg mx-auto lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative lg:row-start-1 lg:col-start-1"
          >
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Modern Çözümler
              </span>{' '}
              <span className="block text-gray-800 xl:inline mt-2">Dijital Dünya</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Dijital dünyanın modern çözümlerini sizin için tasarlıyoruz. Web ve mobil teknolojilerde uzman ekibimizle yanınızdayız.
            </p>
            <div className="mt-8 sm:mt-12 space-x-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:text-lg transform transition hover:scale-105"
              >
                Bize Ulaşın
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg transform transition hover:scale-105"
              >
                Portfolyo
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:row-start-1 lg:col-start-2 mt-8 lg:mt-0"
          >
            <div className="relative">
              <img
                className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 transform transition hover:scale-105"
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
                alt="Çalışma Alanı"
              />
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg w-32 h-32 opacity-20 blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
