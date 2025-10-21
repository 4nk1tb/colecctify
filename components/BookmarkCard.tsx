import React from 'react';
import { motion } from 'framer-motion';
import type { Bookmark } from '../types';
import { Favicon } from './Favicon';
import { Edit, Trash } from './Icons';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onEdit, onDelete }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const displayUrl = React.useMemo(() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch (e) {
      const urlParts = bookmark.url.replace(/^https?:\/\//, '').split('/');
      return urlParts[0];
    }
  }, [bookmark.url]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className="aurora-border group"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        whileHover={{ 
          scale: 1.03,
          boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)',
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        whileTap={{ scale: 0.98, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative flex items-center justify-between h-full p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 dark:border-gray-700/50 space-x-2"
      >
        <a 
          href={bookmark.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1 min-w-0 flex flex-col items-start space-y-3"
        >
          <div className="flex items-start space-x-4 w-full">
            <Favicon url={bookmark.url} title={bookmark.title} className="w-10 h-10 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {bookmark.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {displayUrl}
              </p>
            </div>
          </div>
          {bookmark.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 w-full">
              {bookmark.description}
            </p>
          )}
        </a>
        <div 
          className="flex-shrink-0 flex flex-col space-y-2 lg:hidden lg:group-hover:flex"
        >
          <button 
            onClick={() => onEdit(bookmark)}
            className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label={`Edit ${bookmark.title}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(bookmark)}
            className="p-2 rounded-full bg-white/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Delete ${bookmark.title}`}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};