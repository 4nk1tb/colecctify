import React from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Squares2x2 } from './Icons';

interface MobileNavProps {
  onHomeClick: () => void;
  onCollectionsClick: () => void;
  onNewBookmarkClick: () => void;
  isHomeSelected: boolean;
}

const NavButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; children: React.ReactNode; }> = ({ label, isSelected, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-24 h-full transition-colors focus:outline-none ${
      isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
    }`}
  >
    {children}
    <span className="text-xs font-medium">{label}</span>
  </button>
);


export const MobileNav: React.FC<MobileNavProps> = ({ onHomeClick, onCollectionsClick, onNewBookmarkClick, isHomeSelected }) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 40 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-gray-200/60 dark:bg-gray-800/60 backdrop-blur-xl border-t border-white/30 dark:border-gray-700/50 z-40"
    >
      <div className="flex items-center justify-around h-full">
        <NavButton label="Home" isSelected={isHomeSelected} onClick={onHomeClick}>
          <Home className="w-6 h-6" />
        </NavButton>

        <motion.button
          onClick={onNewBookmarkClick}
          className="flex items-center justify-center w-14 h-14 bg-violet-500 text-white rounded-2xl shadow-lg -translate-y-5 focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-violet-600"
          aria-label="Add new bookmark"
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-7 h-7" />
        </motion.button>
        
        <NavButton label="Collections" isSelected={false} onClick={onCollectionsClick}>
          <Squares2x2 className="w-6 h-6" />
        </NavButton>

      </div>
    </motion.div>
  );
};