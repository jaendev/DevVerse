import React, { InputHTMLAttributes, forwardRef } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
    const inputStyles = `
      block px-4 py-2 w-full rounded-md border 
      ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'} 
      shadow-sm
      focus:outline-none focus:ring-2 focus:ring-opacity-50
      transition-colors
    `;

    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${widthClass} mb-4 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputStyles}
          {...props}
        />
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';