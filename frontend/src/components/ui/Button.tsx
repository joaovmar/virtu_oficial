'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

/**
 * Button - Figma design tokens:
 * Primary: gradient from-[#348981] to-[#c1a784], rounded-[38.176px]
 * Secondary: border #282828, rounded-[20.921px]
 * Outline: border #c1a784, rounded-[38.176px]
 */

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans transition-all duration-300';

  const variants = {
    primary: 'bg-gradient-to-r from-virtu-green to-virtu-gold text-white rounded-[38.176px] hover:opacity-90',
    secondary: 'bg-virtu-dark text-white rounded-[20.921px] hover:bg-virtu-dark/90',
    outline: 'border border-virtu-gold text-virtu-gold rounded-[38.176px] hover:bg-virtu-gold hover:text-white',
  };

  const sizes = {
    sm: 'px-5 py-2 text-[12px] font-semibold',
    md: 'px-8 py-3.5 text-[16px] font-light',
    lg: 'px-10 py-4 text-[20px] font-light',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
}
