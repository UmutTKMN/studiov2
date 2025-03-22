import React from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

const Input = ({
  label,
  error,
  helperText,
  size = 'md',
  disabled = false,
  className,
  leftIcon,
  rightIcon,
  type = 'text',
  ...props
}) => {
  const inputClasses = twMerge(`
    block w-full rounded-lg
    border bg-white
    transition duration-150 ease-in-out
    focus:outline-none focus:ring-2
    disabled:opacity-50
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
    ${leftIcon ? 'pl-10' : ''} 
    ${rightIcon ? 'pr-10' : ''}
    ${sizes[size]}
    ${className}
  `);

  const labelClasses = `
    block mb-2 text-sm font-medium
    ${error ? 'text-red-500' : 'text-gray-700'}
    ${disabled ? 'opacity-60' : ''}
  `;

  const helperTextClasses = `
    mt-1.5 text-sm
    ${error ? 'text-red-500' : 'text-gray-500'}
  `;

  const iconClasses = `
    absolute top-1/2 -translate-y-1/2
    text-gray-400
    pointer-events-none
  `;

  return (
    <div className="relative">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <span className={`${iconClasses} left-3`}>
            {leftIcon}
          </span>
        )}
        
        <input
          type={type}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />

        {rightIcon && (
          <span className={`${iconClasses} right-3`}>
            {rightIcon}
          </span>
        )}
      </div>

      {(error || helperText) && (
        <p className={helperTextClasses}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
