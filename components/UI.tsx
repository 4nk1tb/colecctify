import React from 'react';
// Fix: Import `Variants` and `HTMLMotionProps` types from framer-motion.
import { motion, AnimatePresence, type Variants, type HTMLMotionProps } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/useAppHooks';
import { X, Search } from './Icons';

// --- Dialog Component ---
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const backdropVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  // Fix: Explicitly type `modalVariants` with the `Variants` type to resolve TS error.
  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.96,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.96,
      y: prefersReducedMotion ? 0 : 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-labelledby="dialog-title"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-md m-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <h2 id="dialog-title" className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- EmptyState Component ---
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 text-gray-400 dark:text-gray-500">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="mt-1 max-w-xs">{description}</p>
    </motion.div>
  );
};

// --- GlassButton Component ---
// Fix: Extend `HTMLMotionProps<'button'>` to correctly type props for `motion.button`
// and resolve the `onDrag` type conflict.
interface GlassButtonProps extends HTMLMotionProps<'button'> {}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={`px-4 py-2 font-semibold text-white bg-violet-500/80 rounded-lg shadow-md hover:bg-violet-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-violet-500 transition-colors duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  )
);

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   icon?: React.ReactNode;
   endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, endIcon, ...props }, ref) => (
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">{icon}</div>}
      <input
        ref={ref}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${endIcon ? 'pr-10' : 'pr-4'} py-2 bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow,border-color duration-200 ${className}`}
        {...props}
      />
       {endIcon && <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{endIcon}</div>}
    </div>
  )
);

// --- Textarea Component ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full p-4 bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow,border-color duration-200 ${className}`}
      {...props}
    />
  )
);

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, children, ...props }, ref) => (
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">{icon}</div>}
      <select
        ref={ref}
        className={`w-full appearance-none ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2 bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow,border-color duration-200 ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4 4 4-4m0 6l-4-4-4-4" /></svg>
      </div>
    </div>
  )
);