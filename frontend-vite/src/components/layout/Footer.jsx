import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto relative">
      {/* Footer Bottom */}
      <div className=" bg-white/80 rounded-lg shadow-lg border border-gray-100 px-4">
        <div className="py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-center md:text-left text-gray-500">
            © {currentYear} KahraStudio. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              to="/license"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Lisans
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Çerezler
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
