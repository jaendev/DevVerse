import React, { HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };
  
  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;