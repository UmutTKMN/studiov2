import React from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

const Footer = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  // Sayfa numaralarını oluştur
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return [...new Set(pages)]; // Duplicate dots'ları temizle
  };

  return (
    <nav
      className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`}
    >
      <div className="hidden md:-mt-px md:flex">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`
              inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium
              ${
                currentPage === page
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }
              ${page === "..." ? "cursor-default" : "cursor-pointer"}
            `}
          >
            {page}
          </button>
        ))}
      </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center pt-4 pr-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <ArrowLongLeftIcon className="mr-3 h-5 w-5" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center pt-4 pl-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Next
            <ArrowLongRightIcon className="ml-3 h-5 w-5" />
          </button>
        </div>
    </nav>
  );
};

export default Footer;
