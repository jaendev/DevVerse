import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg transition-all';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    outline: 'border border-gray-200 dark:border-gray-700 bg-transparent',
    elevated: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;