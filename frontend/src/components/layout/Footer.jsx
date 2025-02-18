import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Studio
            </Link>
            <p className="text-gray-400 text-sm">
              Modern ve yaratıcı çözümler üreten dijital stüdyo.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Şirket</h3>
            <ul className="space-y-2">
              {["Hakkımızda", "Kariyer", "İletişim"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Hizmetler</h3>
            <ul className="space-y-2">
              {["Web Tasarım", "Mobil Uygulama", "UI/UX Tasarım"].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Takip Et</h3>
            <div className="flex space-x-4">
              {[
                { name: "Twitter", icon: "twitter" },
                { name: "LinkedIn", icon: "linkedin" },
                { name: "GitHub", icon: "github" }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} Studio. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
