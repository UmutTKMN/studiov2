import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div className="absolute inset-0">
        <svg className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404">
          <defs>
            <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" className="text-white/[0.1]" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:py-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:grid lg:grid-cols-2 lg:gap-8 items-center"
        >
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Projeniz için hazır mısınız?</span>
              <span className="block text-indigo-200 mt-2">Hemen iletişime geçin.</span>
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Size özel çözümler üretmek için sabırsızlanıyoruz. Projelerinizi birlikte hayata geçirelim.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition transform hover:scale-105"
              >
                Bize Ulaşın
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+901234567890"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition transform hover:scale-105"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Hemen Arayın
              </a>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 rounded-lg p-8 backdrop-blur-lg"
            >
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold">E-posta</h3>
                  <p className="mt-2">info@example.com</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold">Telefon</h3>
                  <p className="mt-2">+90 123 456 7890</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold">Adres</h3>
                  <p className="mt-2">İstanbul, Türkiye</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-semibold">Çalışma Saatleri</h3>
                  <p className="mt-2">Pzt-Cum: 09:00-18:00</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
