import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea';
}

export const Input: React.FC<InputProps> = ({ as = 'input', className, ...props }) => {
  const baseClasses = 'w-full px-3 py-2 border-2 border-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600';
  
  if (as === 'textarea') {
    return (
      <textarea
        className={`${baseClasses} ${className}`}
        {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
      />
    );
  }

  return (
    <input
      className={`${baseClasses} ${className}`}
      {...props as React.InputHTMLAttributes<HTMLInputElement>}
    />
  );
};

export const Textarea: React.FC<InputProps> = (props) => <Input as="textarea" {...props} />;