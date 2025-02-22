import React from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-lg'
};

const Select = ({
  label,
  error,
  helperText,
  size = 'md',
  disabled = false,
  className,
  options = [],
  ...props
}) => {
  const selectClasses = twMerge(`
    block w-full rounded-lg
    border bg-white
    transition duration-150 ease-in-out
    focus:outline-none focus:ring-2
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
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

  return (
    <div className="relative">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <select
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {(error || helperText) && (
        <p className={helperTextClasses}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
