import React from 'react';

export const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm 
          ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-blue-600 
          sm:text-sm sm:leading-6
          ${error ? 'ring-red-300 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};