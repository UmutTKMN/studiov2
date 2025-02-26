import React from 'react';
import { twMerge } from 'tailwind-merge';

const variants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const Badge = ({ variant = 'info', children, className = '' }) => {
  return (
    <span className={twMerge(`
      px-2 py-1 rounded-full text-xs
      ${variants[variant]}
      ${className}
    `)}>
      {children}
    </span>
  );
};

export default Badge;